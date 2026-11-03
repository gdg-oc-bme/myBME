"""SAML SP configuration for logging in via BME's eduID (Shibboleth) IdP.

IdP metadata was fetched from https://login.bme.hu/idp/shibboleth and is
cached in metadata/bme_idp.xml. Re-fetch it if BME rotates their signing
certificate (login starts failing with a signature-verification error).
"""
import os
from pathlib import Path

import saml2
from saml2.saml import NAMEID_FORMAT_PERSISTENT

APP_DIR = Path(__file__).resolve().parent
CERT_DIR = APP_DIR / 'certs'
METADATA_DIR = APP_DIR / 'metadata'

SP_BASE_URL = os.environ.get('SAML_SP_BASE_URL', 'http://localhost:8000')

# "xmlsec1" is the backend pysaml2 supports best (shells out to the xmlsec1
# CLI) and is what production should use. It requires `apt install xmlsec1`.
# Where that isn't available (e.g. a sandboxed dev container with no sudo),
# override with SAML_CRYPTO_BACKEND=XMLSecurity, a pure-Python fallback that
# is explicitly marked "untested" by pysaml2 and does not support encrypted
# assertions — don't use it for a real deployment.
CRYPTO_BACKEND = os.environ.get('SAML_CRYPTO_BACKEND', 'xmlsec1')

SAML_CONFIG = {
    'crypto_backend': CRYPTO_BACKEND,
    'entityid': f'{SP_BASE_URL}/saml2/metadata/',
    'allow_unknown_attributes': True,
    'service': {
        'sp': {
            'name': 'myBME',
            'endpoints': {
                'assertion_consumer_service': [
                    (f'{SP_BASE_URL}/saml2/acs/', saml2.BINDING_HTTP_POST),
                ],
                'single_logout_service': [
                    (f'{SP_BASE_URL}/saml2/ls/', saml2.BINDING_HTTP_REDIRECT),
                    (f'{SP_BASE_URL}/saml2/ls/post/', saml2.BINDING_HTTP_POST),
                ],
            },
            # eduPersonPrincipalName is the standard federation-wide unique
            # identifier; the rest are optional until we know exactly what
            # BME's IdP releases to us (depends on SP registration).
            'required_attributes': ['eduPersonPrincipalName'],
            'optional_attributes': ['mail', 'displayName', 'givenName', 'sn'],
            'want_response_signed': True,
            'want_assertions_signed': True,
            'authn_requests_signed': False,
            'logout_requests_signed': True,
            'name_id_format': [NAMEID_FORMAT_PERSISTENT],
        },
    },
    'metadata': {
        'local': [str(METADATA_DIR / 'bme_idp.xml')],
    },
    'key_file': str(CERT_DIR / 'sp.key'),
    'cert_file': str(CERT_DIR / 'sp.crt'),
    'encryption_keypairs': [
        {
            'key_file': str(CERT_DIR / 'sp.key'),
            'cert_file': str(CERT_DIR / 'sp.crt'),
        },
    ],
}
