export const widgetRiskTrendData = [
    {
        dashboardName: "Risk_Trend",
        description: "supplier_dam",
        displayOrder: 1,
        id: 101,
        isVisible: true,
        name: "supplier_dam",
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
            title: 'DAM'
        },
        widgetSize: {
            bsWidth: "col-6",
            height: 50,
            width: 50,
        }
    },
    {
        dashboardName: "Risk_Trend",
        description: "allScoreTrend",
        displayOrder: 2,
        id: 102,
        isVisible: true,
        name: "allScoreTrend",
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
            },
            {
                filtername: 'RiskFactor'
            }],
            title: 'Reliability'
        },
        widgetSize: {
            bsWidth: "col-6",
            height: 50,
            width: 50,
        }
    },
    {
        dashboardName: "Risk_Trend",
        description: "supplierData",
        displayOrder: 3,
        id: 103,
        isVisible: true,
        name: "supplierData",
        widgetBody: {
            table: {
                displayCol: [
                    {
                        className: "classCheckBox",
                        data: "id",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "",
                        visibility: "hidden",
                    },
                    {
                        className: "classSuppliers",
                        data: "supplier",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Supplier",
                        visibility: "visible",
                    },
                    {
                        className: "classDam",
                        data: "dam",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "DAM",
                        visibility: "visible",
                    },
                    {
                        className: "classReliability",
                        data: "rel",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "Reliability",
                        visibility: "visible",
                    },
                    {
                        className: "classAgility",
                        data: "agl",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "Agility",
                        visibility: "visible",
                    },
                    {
                        className: "classResponsiveness",
                        data: "res",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "Responsiveness",
                        visibility: "visible",
                    },
                    {
                        className: "classEs",
                        data: "es",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "ES",
                        visibility: "visible",
                    },
                    {
                        className: "classFs",
                        data: "fs",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "FS",
                        visibility: "visible",
                    },
                    {
                        className: "classQs",
                        data: "qs",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "QS",
                        visibility: "visible",
                    },
                    {
                        className: "classInfoGain",
                        data: "info",
                        dataAlign: "left",
                        dataType: "number",
                        headerAlign: "left",
                        sort: false,
                        title: "Info Gain / Loss",
                        visibility: "visible",
                    },
                    {
                        className: "classExternalRisk",
                        data: "exr",
                        dataAlign: "left",
                        dataType: "array",
                        headerAlign: "left",
                        sort: false,
                        title: "External Risk Factors",
                        visibility: "visible",
                    }
                ],
                data: [
                    {
                        id: 1,
                        supplier: 'Sage Tool Inc',
                        dam: 0.8,
                        rel: 0.5,
                        agl: 0.6,
                        res: 0.5,
                        es: 0.2,
                        fs: 0.8,
                        qs: 0.7,
                        info: 1,
                        exr: [0, 1, 1, 0, 1, 0, 0, 0, 1, 0]
                    },
                    {
                        id: 2,
                        supplier: 'Sage Tool Inc',
                        dam: 0.8,
                        rel: 0.5,
                        agl: 0.6,
                        res: 0.5,
                        es: 0.2,
                        fs: 0.8,
                        qs: 0.7,
                        info: -1,
                        exr: [1, 0, 0, 1, 1, 0, 1, 0, 1, 0]
                    },
                    {
                        id: 3,
                        supplier: 'Sage Tool Inc',
                        dam: 0.8,
                        rel: 0.5,
                        agl: 0.6,
                        res: 0.5,
                        es: 0.2,
                        fs: 0.8,
                        qs: 0.7,
                        info: 1,
                        exr: [0, 0, 1, 1, 0, 1, 0, 1, 1, 1]
                    },
                    {
                        id: 4,
                        supplier: 'Sage Tool Inc',
                        dam: 0.8,
                        rel: 0.5,
                        agl: 0.6,
                        res: 0.5,
                        es: 0.2,
                        fs: 0.8,
                        qs: 0.7,
                        info: -1,
                        exr: [1, 1, 0, 0, 1, 0, 1, 0, 0, 0]
                    },
                    {
                        id: 5,
                        supplier: 'Sage Tool Inc',
                        dam: 0.8,
                        rel: 0.5,
                        agl: 0.6,
                        res: 0.5,
                        es: 0.2,
                        fs: 0.8,
                        qs: 0.7,
                        info: 1,
                        exr: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
                    }
                ]
            }
        },
        widgetHeader: {
            filters: [{
                filtername: 'back'
            }, {
                filtername: 'supplierCompare'
            }],
            title: ''
        },
        widgetSize: {
            bsWidth: "col-12",
            height: 50,
            width: 50,
        }
    }
]