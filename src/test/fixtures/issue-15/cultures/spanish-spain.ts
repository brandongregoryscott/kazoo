import {
    BaseSpanishSpain,
    Culture,
    LocalizationUtils,
    // @ts-ignore
} from "andculturecode-javascript-core";
import { CultureResources } from "../interfaces/culture-resources";

const ProfessionallyTranslatedSpanishSpain = {

};

const SpanishSpain: Culture<CultureResources> = LocalizationUtils.cultureFactory<CultureResources>(BaseSpanishSpain, {
    resources: {
        ...ProfessionallyTranslatedSpanishSpain,
        "addTo": "Añadir a {{container}}",
        "admin": "Administración",
        "all": "todas",
        "allOfItem": "Todo {{item}}",
        "clearAll": "Limpiar todo",
        "clearAllReferences": "Borrar todas las referencias",
        "clearAllReferences-confirmationMessage": "Borrar todas las referencias eliminará todas sus referencias de su panel de referencia.",
        "clearAllReferences_question": "¿Limpiar todo?",
        "content": "Contenido",
        "expired-offline-session-alert-description": "No has iniciado sesión por 21 días.Debe restablecer una conexión a Internet e inicie sesión para acceder al contenido fuera de línea.",
        "expired-offline-session-alert-title": "Su sesión fuera de línea ha caducado",
        "expired-offline-session-warning-description": "No has iniciado sesión por 21 días.Si no restablece una conexión a Internet en las próximas 24 horas, no podrá acceder al contenido fuera de línea.",
        "expired-offline-session-warning-title": "Su sesión fuera de línea expirará en 24 horas.",
        "deviceStorageUsed": "{{cantidad}} del almacenamiento de dispositivos utilizado",
        "inputHintText": "Insinuación: {{text}}",
        "login-offline-warning": "Conectarse a una señal de datos o WiFi para iniciar sesión",
        "offline-removeOfflineBookError": "Se produjo un error al intentar eliminar un libro fuera de línea.",
        "offline-settings-bookmarks-label": "Incluir marcadores y comentarios.",
        "offline-settings-bookmarks-tooltip": "Guarde automáticamente todos sus marcadores de esta publicación para acceder fuera de línea.",
        "offline-settings-enhanced-content-label": "Incluir contenido mejorado",
        "offline-settings-enhanced-content-tooltip": "Además de los códigos, guarde las ideas y explicaciones de NFPA LINK EXPERT con esta publicación para el acceso sin conexión.",
        "offline-settings-header": "Configuración fuera de línea",
        "offline-settings-store-description": "Caché esto en su dispositivo en segundo plano mientras continúa usando el enlace normalmente",
        "offline-settings-store-label": "Tienda para uso fuera de línea",
        "offline-syncErrorMessage": "Se produjo un error al intentar sincronizar un libro sin conexión.",
        "offline-loading-text": "Preparando su experiencia de búsqueda fuera de línea",
        "part": "Parte",
        "publicationOptionsMenu": "Menú de opciones de publicación",
        "redirecting": "Redirección",
        "removeFrom": "Eliminar de {{container}}",
        "part_plural": "Partes",
        "scope": "Alcance",
        "selectItem": "Seleccione un artículo}}",
        "searchHintText": "Utilizar cotizaciones “ “ para una coincidencia exacta.",
        "stored-publication": "publicación almacenada",
        "setAsRole": "Set as {{role}}",
        "support-otherFormsOfContact_answer": "<0>Nuestro equipo de atención al cliente está disponible para ayudarlo {{supportHours}}. Si está fuera de nuestro horario comercial, envíenos un correo electrónico a <3></3> Y le responderemos en nuestro próximo día hábil.</0><1><strong>Teléfono</strong></1><2><0></0> (U.S. & Canada)</2><3><0>{{altPhone}}</0> (U.S. & Canada)</3><4><0></0> (Internacional)</4><5><0>{{mxPhone}}</0> (México)</5>",
        "support-otherFormsOfContact": "Otras formas de contacto.",
        "updatedItem": "Actualizado {{item}}.",
        "userRole": "rol del usuario",
    },
});

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { SpanishSpain };

// #endregion Exports
