from odoo import fields, models


class ResPartner(models.Model):
    _inherit = 'res.partner'

    ban_id = fields.Char(
        string='Identifiant BAN',
        help='Identifiant unique Base Adresse Nationale — utilisé pour les recherches DPE',
        index=True,
    )
    ban_latitude = fields.Float(string='Latitude (BAN)', digits=(10, 7))
    ban_longitude = fields.Float(string='Longitude (BAN)', digits=(10, 7))
