"""Init tables

Revision ID: cdfeb5263f28
Revises: 
Create Date: 2026-11-03 10:50:49.569872

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'cdfeb5263f28'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('users',
        sa.Column(
            'id',
            sa.UUID(),
            nullable=False
        ),
        sa.Column(
            'name',
            sa.String(length=100),
            nullable=False,
            comment='Full name of the user'
        ),
        sa.Column(
            'code',
            sa.String(length=20),
            nullable=False,
            comment='Unique code of the user (Neptun code)'
        ),
        sa.Column(
            'oidc_sub',
            sa.String(length=255),
            nullable=True,
            comment='OIDC subject identifier from identity provider',
        ),
        sa.Column(
            'oidc_issuer',
            sa.String(length=255),
            nullable=True,
            comment='OIDC issuer URL',
        ),
        sa.Column(
            'lti_user_id',
            sa.String(length=255),
            nullable=True,
            comment='LTI user ID from platform launches',
        ),
        sa.Column('major',
            sa.String(length=100),
            nullable=True
        ),
        sa.Column('created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.Column('updated_at',
            sa.DateTime(timezone=True),
            nullable=True
        ),
        sa.Column('email',
            sa.String(length=100),
            nullable=True,
            comment='Contact information of the user'
        ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    roles_table = op.create_table('roles',
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('title')
    )

    op.create_table('user_roles',
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('role_id', sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('user_id', 'role_id')
    )

    op.bulk_insert(roles_table,
        [
            {
                'title': 'Admin'
            },
            {
                'title': 'Student'
            },
            {
                'title': 'Professor'
            }
        ]
    )

    op.create_table('links',
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column(
            'search_terms',
            sa.Text(),
            nullable=True,
            comment='Extra keywords, including Hungarian synonyms'
        ),
        sa.Column(
            'search_vector',
            postgresql.TSVECTOR(),
            sa.Computed(
                "to_tsvector('simple', "
                "coalesce(name, '') || ' ' || "
                "coalesce(description, '') || ' ' || "
                "coalesce(search_terms, ''))",
                persisted=True
            ),
            nullable=True
        ),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(
        'ix_links_search_vector',
        'links',
        ['search_vector'],
        postgresql_using='gin'
    )

    op.create_table('categories',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    op.create_table('link_categories',
        sa.Column('link_id', sa.UUID(), nullable=False),
        sa.Column('category_id', sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(['link_id'], ['links.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('link_id', 'category_id')
    )

    op.create_table('favorites',
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('link_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['link_id'], ['links.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('user_id', 'link_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Drop dependent (FK-holding) tables first.
    op.drop_table('favorites')
    op.drop_table('link_categories')
    op.drop_table('categories')
    op.drop_index('ix_links_search_vector', table_name='links')
    op.drop_table('links')
    op.drop_table('user_roles')
    op.drop_table('roles')
    op.drop_table('users')
