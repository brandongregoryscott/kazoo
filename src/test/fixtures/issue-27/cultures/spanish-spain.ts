import {
    BaseSpanishSpain,
    Culture,
    LocalizationUtils,
    // @ts-ignore
} from "andculturecode-javascript-core";
import { CultureResources } from "../interfaces/culture-resources";

const ProfessionallyTranslatedSpanishSpain = {
    accountInformation: "Información de la cuenta",
    cancelMySubscription: "Cancelar mi suscripción",
    checkOutFaq: "Echa un vistazo a nuestras preguntas frecuentes",
};

const SpanishSpain: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseSpanishSpain,
    {
        resources: {
            subscriptionDetails: "Detalles de suscripción",
            teamManagement: "Gestión de equipos",
        },
    }
);

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { SpanishSpain };

// #endregion Exports
