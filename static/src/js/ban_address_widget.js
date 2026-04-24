/** @odoo-module **/
import { Component, useState, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useDebounced } from "@web/core/utils/timing";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

let _franceId = null;

export class BanAddressWidget extends Component {
    static template = "ibatix_adresse.BanAddressWidget";
    static props = {
        ...standardFieldProps,
        placeholder: { type: String, optional: true },
    };

    setup() {
        this.state = useState({ suggestions: [], open: false });
        this.inputRef = useRef("input");
        this.orm = useService("orm");
        this.debouncedFetch = useDebounced(this._fetchBan.bind(this), 350);
    }

    get displayValue() {
        return this.props.record.data[this.props.name] || "";
    }

    onInput(ev) {
        this.debouncedFetch(ev.target.value);
    }

    onChange(ev) {
        this.props.record.update({ [this.props.name]: ev.target.value });
    }

    async _fetchBan(query) {
        if (!query || query.length < 4) {
            this.state.open = false;
            this.state.suggestions = [];
            return;
        }
        try {
            const resp = await fetch(
                `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=6&type=housenumber`
            );
            const data = await resp.json();
            this.state.suggestions = data.features || [];
            this.state.open = this.state.suggestions.length > 0;
        } catch {
            this.state.open = false;
            this.state.suggestions = [];
        }
    }

    async _getFranceId() {
        if (!_franceId) {
            const ids = await this.orm.search("res.country", [["code", "=", "FR"]], { limit: 1 });
            _franceId = ids[0] || null;
        }
        return _franceId;
    }

    async selectSuggestion(feature) {
        const p = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;

        const updates = {
            street: p.name,
            zip: p.postcode,
            city: p.city,
        };

        if ("ban_id" in this.props.record.fields) {
            updates.ban_id = p.id;
        }
        if ("ban_latitude" in this.props.record.fields) {
            updates.ban_latitude = lat;
            updates.ban_longitude = lon;
        }

        const countryId = await this._getFranceId();
        if (countryId) {
            updates.country_id = countryId;
        }

        await this.props.record.update(updates);
        this.state.open = false;
        this.state.suggestions = [];
    }

    onBlur() {
        setTimeout(() => { this.state.open = false; }, 200);
    }
}

registry.category("fields").add("ban_address", {
    component: BanAddressWidget,
    supportedTypes: ["char"],
    extractProps({ attrs }) {
        return { placeholder: attrs.placeholder || "" };
    },
});
