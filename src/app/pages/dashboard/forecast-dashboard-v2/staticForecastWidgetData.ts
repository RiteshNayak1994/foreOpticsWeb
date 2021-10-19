export const widgetForecastData = [
    {
        dashboardName: "Forecast",
        description: "top5Supplier",
        displayOrder: 1,
        id: 1011,
        isVisible: true,
        name: "top5Supplier",
        widgetBody: {
            chart: {
                type: "spline",
                xAxisCol: ['JAN', 'FEB', 'MAR', 'APR', 'MAY'],
                apiData: [{
                    name: 'HONEYWELL MSS',
                    type: 'spline',
                    data: [0.2, 0.5, 0.6, 0.8, 0.5]

                }, {
                    name: 'METAL FUSION INC.',
                    type: 'spline',
                    data: [0.4, 0.8, 1, 0.5, 0.4]
                }, {
                    name: 'PARKER HANNIFIN',
                    type: 'spline',
                    data: [1, 0.7, 0.8, 0.6, 0.7]
                }, {
                    name: 'PLANSEE USA LLC',
                    type: 'spline',
                    data: [0.5, 0.6, 0.7, 0.8, 0.9]
                }, {
                    name: 'TMA PRECISION TUBE LLC',
                    type: 'spline',
                    data: [0.8, 0.5, 0.7, 0.6, 1]
                }]
            }
        },
        widgetHeader: {
            filters: [{
                filtername: 'dataview'
            }],
            title: 'Top 5 Supplier'
        },
        widgetSize: {
            bsWidth: "col-6",
            height: 50,
            width: 50,
        }
    },
    {
        dashboardName: "Forecast",
        description: "last5Supplier",
        displayOrder: 2,
        id: 1012,
        isVisible: true,
        name: "last5Supplier",
        widgetBody: {
            chart: {
                type: "spline",
                xAxisCol: ['JAN', 'FEB', 'MAR', 'APR', 'MAY'],
                apiData: [{
                    name: 'HONEYWELL MSS',
                    type: 'spline',
                    data: [0.2, 0.5, 0.6, 0.8, 0.5]

                }, {
                    name: 'METAL FUSION INC.',
                    type: 'spline',
                    data: [0.4, 0.8, 1, 0.5, 0.4]
                }, {
                    name: 'PARKER HANNIFIN',
                    type: 'spline',
                    data: [1, 0.7, 0.8, 0.6, 0.7]
                }, {
                    name: 'PLANSEE USA LLC',
                    type: 'spline',
                    data: [0.5, 0.6, 0.7, 0.8, 0.9]
                }, {
                    name: 'TMA PRECISION TUBE LLC',
                    type: 'spline',
                    data: [0.8, 0.5, 0.7, 0.6, 1]
                }]
            }
        },
        widgetHeader: {
            filters: [{
                filtername: 'dataview'
            }],
            title: 'Last 5 Supplier'
        },
        widgetSize: {
            bsWidth: "col-6",
            height: 50,
            width: 50,
        }
    }
]