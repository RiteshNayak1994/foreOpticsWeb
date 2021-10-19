export const widgetData = [
    {
        dashboardName: "risk_profile",
        description: "supplier_dam",
        displayOrder: 1,
        id: 101,
        isVisible: true,
        name: "supplier_dam",
        widgetBody: {
            chart: {
                type: "bar",
                xAxisCol: ['Sage Tool Inc', 'Castle Aeronautics', 'Boeing', 'EIS Inc.',
                    'Meyer Tool Inc.', 'Kansas Aviation Of Independece', 'Air Parts and Supply Co.'],
                apiData: [{
                    name: 'DAM',
                    data: [0.5, 0.3, 0.6, 0.8, 1, 0.7, 0.9]
                }]
            }
        },
        widgetHeader: {
            filters: null,
            title: 'Supplier By DAM'
        },
        widgetSize: {
            bsWidth: "col-4",
            height: 50,
            width: 50,
        }
    },
    {
        dashboardName: "Risk_Profile",
        description: "rar_esqsfs",
        displayOrder: 2,
        id: 34,
        isVisible: true,
        name: "rar_esqsfs",
        widgetBody: {
            chart: {
                type: "heatmap",
                xAxisCol: ['REL', 'RES', 'AGL'],
                yAxisCol: ['ABC', 'XYZ', 'TYU', 'OKM', 'TGF'],
                apiData: [
                    [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], 
                    [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], 
                    [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], 
                    [2, 2, 123], [2, 3, 64], [2, 4, 52]
                ]
            }
        },
        widgetHeader: {
            filters: [{
                filtername: 'RARESFSQS'
            }],
            title: 'DAM Drivers'
        },
        widgetSize: {
            bsWidth: "col-4",
            height: 50,
            width: 50,
        }
    },
    {
        dashboardName: "risk_profile",
        description: "dam_variance",
        displayOrder: 3,
        id: 103,
        isVisible: true,
        name: "dam_variance",
        widgetBody: {
            table: {
                displayCol: [
                    {
                        className: "classSuppliers",
                        data: "name",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Supplier",
                        visibility: "visible",
                    },
                    {
                        className: "classDamVariance",
                        data: "damVariance",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "DAM Variance",
                        visibility: "visible",
                    }
                ],
                data: [
                    {
                        id: 1,
                        name: 'Sage Tool Inc',
                        damVariance: 0.5
                    },
                    {
                        id: 2,
                        name: 'Castle Aeronautics',
                        damVariance: 0.2
                    },
                    {
                        id: 3,
                        name: 'Boeing',
                        damVariance: -0.5
                    },
                    {
                        id: 4,
                        name: 'EIS Inc.',
                        damVariance: 0.5
                    },
                    {
                        id: 5,
                        name: 'Meyer Tool Inc.',
                        damVariance: -0.2
                    }
                ]
            }
        },
        widgetHeader: {
            filters: null,
            title: 'DAM Variance'
        },
        widgetSize: {
            bsWidth: "col-4",
            height: 50,
            width: 50,
        }
    },
    {
        dashboardName: "risk_profile",
        description: "open_orders",
        displayOrder: 4,
        id: 104,
        isVisible: true,
        name: "open_orders",
        widgetBody: {
            table: {
                displayCol: [
                    {
                        className: "classPO",
                        data: "po",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "PO",
                        visibility: "visible",
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
                        className: "classDueDate",
                        data: "dueDate",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Due Date",
                        visibility: "visible",
                    },
                    {
                        className: "classPartNumber",
                        data: "partNumber",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Part Number",
                        visibility: "visible",
                    },
                    {
                        className: "classPoLine",
                        data: "poLine",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "PO Line",
                        visibility: "visible",
                    },
                    {
                        className: "classOrderedQty",
                        data: "orderedQty",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "Ordered Qty",
                        visibility: "visible",
                    },
                    {
                        className: "classDam",
                        data: "dam",
                        dataAlign: "left",
                        dataType: "string",
                        headerAlign: "left",
                        sort: false,
                        title: "DAM",
                        visibility: "visible",
                    }
                ],
                data: [
                    {
                        id: 1,
                        po: 'YU123',
                        supplier: 'Sage Tool Inc',
                        dueDate: '2021-04-21T07:06:03.173',
                        partNumber: 56,
                        orderedQty: 20,
                        poLine: '786',
                        dam: 0.7
                    },
                    {
                        id: 2,
                        po: 'ABC123',
                        supplier: 'Castle Aeronautics',
                        dueDate: '2021-03-09T07:06:03.173',
                        partNumber: 14,
                        orderedQty: 75,
                        poLine: '71WE0',
                        dam: 0.5
                    },
                    {
                        id: 3,
                        po: 'A90123',
                        supplier: 'Boeing',
                        dueDate: '2021-05-27T07:06:03.173',
                        partNumber: 144,
                        orderedQty: 2,
                        poLine: '74FG7',
                        dam: 0.2
                    },
                    {
                        id: 4,
                        po: '89OP123',
                        supplier: 'EIS Inc.',
                        dueDate: '2021-08-21T07:06:03.173',
                        partNumber: 1122,
                        orderedQty: 450,
                        poLine: '7BN5200',
                        dam: 0.6
                    },
                    {
                        id: 5,
                        po: 'A1KLO3',
                        supplier: 'Meyer Tool Inc.',
                        dueDate: '2021-01-11T07:06:03.173',
                        partNumber: 774,
                        orderedQty: 478,
                        poLine: '8241RT0',
                        dam: 1
                    }
                ]
            }
        },
        widgetHeader: {
            filters: [{
                filtername: 'back'
            }],
            title: 'Open Orders At Risk'
        },
        widgetSize: {
            bsWidth: "col-12",
            height: 50,
            width: 50,
        }
    }
]