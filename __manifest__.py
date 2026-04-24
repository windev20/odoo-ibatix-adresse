{
    'name': 'Adresse BAN — Autocomplétion',
    'version': '19.0.1.0.0',
    'category': 'Technical',
    'summary': 'Autocomplétion adresse via la Base Adresse Nationale (BAN) sur la fiche client',
    'author': 'ibatix',
    'depends': ['base', 'contacts'],
    'assets': {
        'web.assets_backend': [
            'ibatix_adresse/static/src/css/ban_address.css',
            'ibatix_adresse/static/src/xml/ban_address_widget.xml',
            'ibatix_adresse/static/src/js/ban_address_widget.js',
        ],
    },
    'data': [
        'views/res_partner_views.xml',
    ],
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
