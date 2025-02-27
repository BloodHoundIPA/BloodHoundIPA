import 'core-js/stable';
import 'regenerator-runtime/runtime'; // generators
import React from 'react';
import ReactDOM from 'react-dom';

import AppContainer from './AppContainer';
import Login from './components/Float/Login';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import { remote, shell } from 'electron';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import ConfigStore from 'electron-store';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import { EventEmitter2 as e } from 'eventemitter2';

const { app } = remote;

global.conf = new ConfigStore();
global.imageconf = new ConfigStore({
    name: 'images',
});
global.emitter = new e({});
emitter.setMaxListeners(0);
global.renderEmit = new e({});
global.Mustache = require('mustache');

//open links externally by default
$(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault();
    shell.openExternal(this.href);
});

String.prototype.format = function () {
    let i = 0;
    const args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] !== 'undefined' ? args[i++] : '';
    });
};

String.prototype.formatAll = function () {
    return this.replace(/{}/g, arguments[0]);
};

String.prototype.formatn = function () {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        const regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

Array.prototype.allEdgesSameType = function () {
    for (let i = 1; i < this.length; i++) {
        if (this[i].neo4j_type !== this[0].neo4j_type) return false;
    }

    return true;
};

Array.prototype.chunk = function (chunkSize = 10000) {
    let i;
    let len = this.length;
    let temp = [];

    for (i = 0; i < len; i += chunkSize) {
        temp.push(this.slice(i, i + chunkSize));
    }

    return temp;
};

if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
}

sigma.renderers.def = sigma.renderers.canvas;

sigma.classes.graph.addMethod('outboundNodes', function (id) {
    return this.outNeighborsIndex.get(id).keyList();
});

sigma.classes.graph.addMethod('inboundNodes', function (id) {
    return this.inNeighborsIndex.get(id).keyList();
});

sigma.classes.graph.addMethod('outNeighbors', function (id) {
    return this.outNeighborsIndex.get(id).keyList();
});

global.appStore = {
    dagre: true,
    startNode: null,
    endNode: null,
    prebuiltQuery: [],
    highlightedEdges: [],
    spotlightData: {},
    queryStack: [],
    currentTooltip: null,
    highResPalette: {
        iconScheme: {
            User: {
                font: "'Font Awesome 5 Free'",
                content: '\uf007',
                scale: 1.5,
                color: '#17E625',
            },
            Computer: {
                font: "'Font Awesome 5 Free'",
                content: '\uF108',
                scale: 1.2,
                color: '#E67873',
            },
            Group: {
                font: "'Font Awesome 5 Free'",
                content: '\uF0C0',
                scale: 1.5,
                color: '#DBE617',
            },
            Domain: {
                font: "'Font Awesome 5 Free'",
                content: '\uF0AC',
                scale: 1.5,
                color: '#17E6B9',
            },
            OU: {
                font: "'Font Awesome 5 Free'",
                content: '\uF0E8',
                scale: 1.25,
                color: '#FFAA00',
            },
            Container: {
                font: "'Font Awesome 5 Free'",
                content: '\uF466',
                scale: 1.25,
                color: '#F79A78',
            },
            GPO: {
                font: "'Font Awesome 5 Free'",
                content: '\uF03A',
                scale: 1.25,
                color: '#7F72FD',
            },
            IPAUser: {
                font: "'Font Awesome 5 Free'",
                content: '\uf007',
                scale: 1.5,
                color: '#17B2E6',
            },
            IPAHost: {
                font: "'Font Awesome 5 Free'",
                content: '\uF108',
                scale: 1.2,
                color: '#171AE6',
            },
            IPAUserGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uF0C0',
                scale: 1.5,
                color: '#DBE617',
            },
            IPAHostGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uF233',
                scale: 1.5,
                color: '#DBE617',
            },
            IPANetGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uF6FF',
                scale: 1.5,
                color: '#DBE617',
            },
            IPASudo: {
                font: "'Font Awesome 5 Free'",
                content: '\uf120',
                scale: 1.5,
                color: '#17E625',
            },
            IPASudoGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uf03a',
                scale: 1.5,
                color: '#17E625',
            },
            IPASudoRule: {
                font: "'Font Awesome 5 Free'",
                content: '\uf02d',
                scale: 1.5,
                color: '#17E625',
            },
            IPAHBACRule: {
                font: "'Font Awesome 5 Free'",
                content: '\uF0AE',
                scale: 1.5,
                color: '#9be072',
            },
            IPAHBACService: {
                font: "'Font Awesome 5 Free'",
                content: '\uF00C',
                scale: 1.2,
                color: '#17E625',
            },
            IPAHBACServiceGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uF560',
                scale: 1.5,
                color: '#DBE617',
            },
            IPARole: {
                font: "'Font Awesome 5 Free'",
                content: '\uf2b9',
                scale: 1.5,
                color: '#17E625',
            },
            IPAPrivilege: {
                font: "'Font Awesome 5 Free'",
                content: '\ue09a',
                scale: 1.5,
                color: '#17E625',
            },
            IPAPermission: {
                font: "'Font Awesome 5 Free'",
                content: '\uf062',
                scale: 1.5,
                color: '#17E625',
            },
            IPAService: {
                font: "'Font Awesome 5 Free'",
                content: '\uf013',
                scale: 1.5,
                color: '#17E625',
            },
            AZUser: {
                font: "'Font Awesome 5 Free'",
                content: '\uf007',
                scale: 1.25,
                color: '#34D2EB',
            },
            AZRole: {
                font: "'Font Awesome 5 Free'",
                content: '\uf2d2',
                scale: 1.25,
                color: '#ED8537',
            },
            AZGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uF0C0',
                scale: 1.25,
                color: '#34D2EB',
            },
            AZTenant: {
                font: "'Font Awesome 5 Free'",
                content: '\uf0c2',
                scale: 1.25,
                color: '#3975b3',
            },
            AZSubscription: {
                font: "'Font Awesome 5 Free'",
                content: '\uf084',
                scale: 1.25,
                color: '#E6E600',
            },
            AZResourceGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uf1b2',
                scale: 1.25,
                color: '#FFE066',
            },
            AZManagementGroup: {
                font: "'Font Awesome 5 Free'",
                content: '\uf1b2',
                scale: 1.25,
                color: '#BD93D8',
            },
            AZVM: {
                font: "'Font Awesome 5 Free'",
                content: '\uf108',
                scale: 1.25,
                color: '#34D2EB',
            },
            AZDevice: {
                font: "'Font Awesome 5 Free'",
                content: '\uf108',
                scale: 1.25,
                color: '#B18FCF',
            },
            AZContainerRegistry: {
                font: "'Font Awesome 5 Free'",
                content: '\uf49e',
                scale: 1.25,
                color: '#0885D7',
            },
            AZAutomationAccount: {
                font: "'Font Awesome 5 Free'",
                content: '\uf085',
                scale: 1.25,
                color: '#F4BA44',
            },
            AZLogicApp: {
                font: "'Font Awesome 5 Free'",
                content: '\uf0e8',
                scale: 1.25,
                color: '#9EE047',
            },
            AZFunctionApp: {
                font: "'Font Awesome 5 Free'",
                content: '\uf0e7',
                scale: 1.25,
                color: '#F4BA44',
            },
            AZWebApp: {
                font: "'Font Awesome 5 Free'",
                content: '\uf247',
                scale: 1.25,
                color: '#4696E9',
            },
            AZManagedCluster: {
                font: "'Font Awesome 5 Free'",
                content: '\uf1b3',
                scale: 1.25,
                color: '#326CE5',
            },
            AZVMScaleSet: {
                font: "'Font Awesome 5 Free'",
                content: '\uf233',
                scale: 1.25,
                color: '#007CD0',
            },
            AZKeyVault: {
                font: "'Font Awesome 5 Free'",
                content: '\uf023',
                scale: 1.25,
                color: '#E83F6F',
            },
            AZApp: {
                font: "'Font Awesome 5 Free'",
                content: '\uf2d2',
                scale: 1.25,
                color: '#03fc84',
            },
            AZServicePrincipal: {
                font: "'Font Awesome 5 Free'",
                content: '\uf544',
                scale: 1.25,
                color: '#c1d6d6',
            },
            Base: {
                font: "'Font Awesome 5 Free'",
                content: '\uF128',
                scale: 1.25,
                color: '#E6E600',
            },
        },
        edgeScheme: {
            AdminTo: 'tapered',
            MemberOf: 'tapered',
            HasSession: 'tapered',
            AllExtendedRights: 'tapered',
            ForceChangePassword: 'tapered',
            GenericAll: 'tapered',
            GenericWrite: 'tapered',
            WriteDacl: 'tapered',
            WriteOwner: 'tapered',
            AddMember: 'tapered',
            TrustedBy: 'curvedArrow',
            DCSync: 'tapered',
            Contains: 'tapered',
            GPLink: 'tapered',
            Owns: 'tapered',
            CanRDP: 'tapered',
            ExecuteDCOM: 'tapered',
            ReadLAPSPassword: 'tapered',
            AllowedToDelegate: 'tapered',
            AddAllowedToAct: 'tapered',
            AllowedToAct: 'tapered',
            GetChanges: 'tapered',
            GetChangesAll: 'tapered',
            SQLAdmin: 'tapered',
            ReadGMSAPassword: 'tapered',
            HasSIDHistory: 'tapered',
            CanPSRemote: 'tapered',
            AddSelf: 'tapered',
            WriteSPN: 'tapered',
            AddKeyCredentialLink: 'tapered',
            SyncLAPSPassword: 'tapered',
            DumpSMSAPassword: 'tapered',
        },
    },
    lowResPalette: {
        colorScheme: {
            User: '#17E625',
            Computer: '#E67873',
            Group: '#DBE617',
            Domain: '#17E6B9',
            OU: '#FFAA00',
            GPO: '#7F72FD',
            Base: '#E6E600',
        },
        edgeScheme: {
            AdminTo: 'line',
            MemberOf: 'line',
            HasSession: 'line',
            AllExtendedRights: 'line',
            ForceChangePassword: 'line',
            GenericAll: 'line',
            GenericWrite: 'line',
            WriteDacl: 'line',
            WriteOwner: 'line',
            AddMember: 'line',
            TrustedBy: 'curvedArrow',
            DCSync: 'line',
            Contains: 'line',
            GPLink: 'line',
            Owns: 'line',
            CanRDP: 'line',
            ExecuteDCOM: 'line',
            ReadLAPSPassword: 'line',
            AllowedToDelegate: 'line',
            AddAllowedToAct: 'line',
            AllowedToAct: 'line',
            GetChanges: 'line',
            GetChangeAll: 'line',
            SQLAdmin: 'line',
            ReadGMSAPassword: 'line',
            HasSIDHistory: 'line',
            CanPSRemote: 'line',
            SyncLAPSPassword: 'line',
            DumpSMSAPassword: 'line',
        },
    },
    highResStyle: {
        nodes: {
            label: {
                by: 'label',
            },
            size: {
                by: 'degree',
                bins: 5,
                min: 10,
                max: 20,
            },
            icon: {
                by: 'type',
                scheme: 'iconScheme',
            },
        },
        edges: {
            type: {
                by: 'type',
                scheme: 'edgeScheme',
            },
            size: {
                by: 'degree',
                bins: 1,
                min: 4,
                max: 4,
            },
        },
    },
    lowResStyle: {
        nodes: {
            label: {
                by: 'label',
            },
            size: {
                by: 'degree',
                bins: 10,
                min: 10,
                max: 20,
            },
            color: {
                by: 'type',
                scheme: 'colorScheme',
            },
        },
        edges: {
            type: {
                by: 'type',
                scheme: 'edgeScheme',
            },
            size: {
                by: 'degree',
                bins: 1,
                min: 4,
                max: 4,
            },
        },
    },
};

if (typeof conf.get('performance') === 'undefined') {
    conf.set('performance', {
        edge: 5,
        lowGraphics: false,
        nodeLabels: 0,
        edgeLabels: 0,
        darkMode: false,
    });
}

if (typeof conf.get('edgeincluded') === 'undefined') {
    conf.set('edgeincluded', {
        MemberOf: true,
        HasSession: true,
        AdminTo: true,
        AllExtendedRights: true,
        AddMember: true,
        ForceChangePassword: true,
        GenericAll: true,
        GenericWrite: true,
        Owns: true,
        WriteDacl: true,
        WriteOwner: true,
        CanRDP: true,
        ExecuteDCOM: true,
        AllowedToDelegate: true,
        ReadLAPSPassword: true,
        Contains: true,
        GPLink: true,
        AddAllowedToAct: true,
        AllowedToAct: true,
        WriteAccountRestrictions: true,
        SQLAdmin: true,
        ReadGMSAPassword: true,
        HasSIDHistory: true,
        CanPSRemote: true,
        SyncLAPSPassword: true,
        DumpSMSAPassword: true,
        AZMGGrantRole: true,
        AZMGAddSecret: true,
        AZMGAddOwner: true,
        AZMGAddMember: true,
        AZMGGrantAppRoles: true,
        AZNodeResourceGroup: true,
        AZWebsiteContributor: true,
        AZLogicAppContributo: true,
        AZAutomationContributor: true,
        AZAKSContributor: true,
    });
}

const alertOptions = {
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '30px',
    transitions: transitions.FADE,
    containerStyle: {
        zIndex: 100,
        width: '100%',
    },
};

appStore.edgeincluded = conf.get('edgeincluded');
appStore.performance = conf.get('performance');

if (typeof appStore.performance.edgeLabels === 'undefined') {
    appStore.performance.edgeLabels = 0;
    conf.set('performance', appStore.performance);
}

if (typeof appStore.performance.darkMode === 'undefined') {
    appStore.performance.darkMode = false;
    conf.set('performance', appStore.performance);
}

const custompath = join(app.getPath('userData'), 'customqueries.json');
if (!existsSync(custompath)) {
    writeFileSync(custompath, '{"queries": []}');
}

let imagepath = join(app.getPath('userData'), 'images');
if (!existsSync(imagepath)) {
    mkdirSync(imagepath);
}

global.closeTooltip = function () {
    emitter.emit('closeTooltip');
};

renderEmit.on('login', function () {
    emitter.removeAllListeners();
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    let Root = () => (
        <AlertProvider
            id='alertContainer'
            template={AlertTemplate}
            {...alertOptions}
        >
            <AppContainer />
        </AlertProvider>
    );
    ReactDOM.render(<Root />, document.getElementById('root'));
});

renderEmit.on('logout', function () {
    emitter.removeAllListeners();
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<Login />, document.getElementById('root'));
});

ReactDOM.render(<Login />, document.getElementById('root'));
