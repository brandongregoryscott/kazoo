import {
    BaseSpanishSpain,
    Culture,
    LocalizationUtils,
    // @ts-ignore
} from "andculturecode-javascript-core";
import { CultureResources } from "../interfaces/culture-resources";

const ProfessionallyTranslatedSpanishSpain = {
    "accountInformation": "Información de la cuenta",
    "subscriptionDetails": "Detalles de suscripción",
};

const SpanishSpain: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseSpanishSpain,
    {
        resources: {
            ...ProfessionallyTranslatedSpanishSpain,
            "cancelMySubscription": "Cancelar mi suscripción",
            "checkOutFaq": "Echa un vistazo a nuestras preguntas frecuentes",
            "teamManagement": "Gestión de equipos",
        },
    }
);

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { SpanishSpain };

// #endregion Exports
