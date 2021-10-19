import { inventoryCol } from "./staticColDataInventoryForecast";

export const inventoryWidget = {
    created: "2021-06-01T12:23:10.267",
    dashboardName: "Demand_Supply_Gap",
    description: "Inventory Forecast Trend",
    displayOrder: 2,
    id: 150,
    isActive: true,
    isQuerySp: false,
    isVisible: true,
    name: "InventoryForecastTrend",
    query: "",
    tenantId: 1,
    userId: 1,
    widgetBody: {
        chart: {
            type: "column",
            width: "col-5"
        },
        table: inventoryCol,
    },
    widgetHeader: {
        filters: [],
        title: "Inventory Health - Column"
    },
    widgetSize: {
        height: 50,
        width: 50
    }
}

export const inventoryWidget_1 = {
    created: "2021-06-01T12:23:10.267",
    dashboardName: "Demand_Supply_Gap",
    description: "Inventory Forecast Trend",
    displayOrder: 3,
    id: 160,
    isActive: true,
    isQuerySp: false,
    isVisible: true,
    name: "InventoryForecastTrend",
    query: "",
    tenantId: 1,
    userId: 1,
    widgetBody: {
        chart: {
            type: "errorBar",
            width: "col-5",
        },
        table: inventoryCol
    },
    widgetHeader: {
        filters: [],
        title: "Inventory Health - Error Bar"
    },
    widgetSize: {
        height: 50,
        width: 50
    }
}