"""initial schema

Revision ID: a97ecde1e458
Revises:
Create Date: 2026-10-28 09:44:00.804954

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'a97ecde1e458'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            eduid_subject text NOT NULL UNIQUE,
            email text,
            display_name text,
            role text NOT NULL DEFAULT 'student'
                CHECK (role IN ('student', 'professor', 'admin')),
            created_at timestamptz NOT NULL DEFAULT now(),
            last_login_at timestamptz
        )
        """
    )

    op.execute(
        """
        CREATE TABLE links (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL,
            url text NOT NULL,
            description text,
            search_terms text,
            search_vector tsvector GENERATED ALWAYS AS (
                to_tsvector(
                    'simple',
                    coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(search_terms, '')
                )
            ) STORED,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
        """
    )
    op.execute("CREATE INDEX links_search_vector_idx ON links USING GIN (search_vector)")

    op.execute(
        """
        CREATE TABLE categories (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL UNIQUE
        )
        """
    )

    op.execute(
        """
        CREATE TABLE link_categories (
            link_id uuid NOT NULL REFERENCES links(id) ON DELETE CASCADE,
            category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
            PRIMARY KEY (link_id, category_id)
        )
        """
    )

    op.execute(
        """
        CREATE TABLE favorites (
            user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            link_id uuid NOT NULL REFERENCES links(id) ON DELETE CASCADE,
            created_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (user_id, link_id)
        )
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS favorites")
    op.execute("DROP TABLE IF EXISTS link_categories")
    op.execute("DROP TABLE IF EXISTS categories")
    op.execute("DROP TABLE IF EXISTS links")
    op.execute("DROP TABLE IF EXISTS users")
