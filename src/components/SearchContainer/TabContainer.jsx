import React, { Component } from 'react';
import DatabaseDataDisplay from './Tabs/DatabaseDataDisplay';
import PrebuiltQueriesDisplay from './Tabs/PrebuiltQueriesDisplay';
import NoNodeData from './Tabs/NoNodeData';
import UserNodeData from './Tabs/UserNodeData';
import GroupNodeData from './Tabs/GroupNodeData';
import ComputerNodeData from './Tabs/ComputerNodeData';
import DomainNodeData from './Tabs/DomainNodeData';
import GpoNodeData from './Tabs/GPONodeData';
import OuNodeData from './Tabs/OUNodeData';
import AZGroupNodeData from './Tabs/AZGroupNodeData';
import AZUserNodeData from './Tabs/AZUserNodeData';
import AZContainerRegistryNodeData from './Tabs/AZContainerRegistryNodeData';
import AZAutomationAccountNodeData from './Tabs/AZAutomationAccountNodeData';
import AZLogicAppNodeData from './Tabs/AZLogicAppNodeData';
import AZFunctionAppNodeData from './Tabs/AZFunctionAppNodeData';
import AZWebAppNodeData from './Tabs/AZWebAppNodeData';
import AZManagedClusterNodeData from './Tabs/AZManagedClusterNodeData';
import AZVMScaleSetNodeData from './Tabs/AZVMScaleSetNodeData';
import AZKeyVaultNodeData from './Tabs/AZKeyVaultNodeData';
import AZResourceGroupNodeData from './Tabs/AZResourceGroupNodeData';
import AZDeviceNodeData from './Tabs/AZDeviceNodeData';
import AZSubscriptionNodeData from './Tabs/AZSubscriptionNodeData';
import AZTenantNodeData from './Tabs/AZTenantNodeData';
import AZVMNodeData from './Tabs/AZVMNodeData';
import AZServicePrincipalNodeData from './Tabs/AZServicePrincipal';
import AZAppNodeData from './Tabs/AZApp';
import { Tabs, Tab } from 'react-bootstrap';
import { openSync, readSync, closeSync } from 'fs';
import imageType from 'image-type';
import { withAlert } from 'react-alert';
import styles from './TabContainer.module.css';
import BaseNodeData from "./Tabs/BaseNodeData";
import ContainerNodeData from "./Tabs/ContainerNodeData";
import AZManagementGroupNodeData from "./Tabs/AZManagementGroupNodeData";
import AZRoleNodeData from "./Tabs/AZRoleNodeData";
import IPAUserNodeData from './Tabs/IPAUserNodeData';
import IPAHostNodeData from './Tabs/IPAHostNodeData';
import IPAUserGroupNodeData from './Tabs/IPAUserGroupNodeData';
import IPAHostGroupNodeData from './Tabs/IPAHostGroupNodeData';
import IPANetGroupNodeData from './Tabs/IPANetGroupNodeData';
import IPASudoNodeData from './Tabs/IPASudoNodeData';
import IPASudoGroupNodeData from './Tabs/IPASudoGroupNodeData';
import IPASudoRuleNodeData from './Tabs/IPASudoRuleNodeData';
import IPAHBACRuleNodeData from './Tabs/IPAHBACRuleNodeData';
import IPAHBACServiceNodeData from './Tabs/IPAHBACServiceNodeData';
import IPAHBACServiceGroupNodeData from './Tabs/IPAHBACServiceGroupNodeData';
import IPAPermissionNodeData from './Tabs/IPAPermissionNodeData';
import IPAPrivilegeNodeData from './Tabs/IPAPrivilegeNodeData';
import IPARoleNodeData from './Tabs/IPARoleNodeData';
import IPAServiceNodeData from './Tabs/IPAServiceNodeData';


class TabContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            baseVisible: false,
            userVisible: false,
            computerVisible: false,
            groupVisible: false,
            domainVisible: false,
            gpoVisible: false,
            ouVisible: false,
            containerVisible: false,
            IPAhostVisible: false,
            azGroupVisible: false,
            azUserVisible: false,
            azContainerRegistryVisible: false,
            azLogicAppVisible: false,
            azFunctionAppVisible: false,
            azWebAppVisible: false,
            azManagedClusterVisible: false,
            azVMScaleSetVisible: false,
            azKeyVaultVisible: false,
            azResourceGroupVisible: false,
            azDeviceVisible: false,
            azSubscriptionVisible: false,
            azTenantVisible: false,
            azVMVisible: false,
            azServicePrincipalVisible: false,
            azAppVisible: false,
            azManagementGroupVisible: false,
            azRoleVisible: false,
            ipaUserVisible: false,
            ipaUserGroupVisible: false,
            ipaHostGroupVisible: false,
            ipaNetGroupVisible: false,
            ipaSudoVisible: false,
            ipaSudoGroupVisible: false,
            ipaSudoRuleVisible: false,
            ipaHBACRuleVisible: false,
            ipaHBACServiceVisible: false,
            ipaHBACServiceGroupVisible: false,
            ipaPermissionVisible: false,
            ipaPrivilegeVisible: false,
            ipaRoleVisible: false,
            ipaServiceVisible: false,
            selected: 1,
        };
    }

    clearVisible() {
        let temp = this.state;
        for (let key in temp) {
            if (key.includes('Visible'))
                temp[key] = false
        }

        this.setState(temp)
    }

    nodeClickHandler(type) {
        if (type === 'User') {
            this._userNodeClicked();
        } else if (type === 'Group') {
            this._groupNodeClicked();
        } else if (type === 'Computer') {
            this._computerNodeClicked();
        } else if (type === 'Domain') {
            this._domainNodeClicked();
        } else if (type === 'OU') {
            this._ouNodeClicked();
        } else if (type === 'GPO') {
            this._gpoNodeClicked();
        } else if (type === 'IPAHost') {
            this._ipaHostNodeClicked();
        } else if (type === 'AZGroup') {
            this._azGroupNodeClicked();
        } else if (type === 'AZUser') {
            this._azUserNodeClicked();
        } else if (type === 'AZContainerRegistry') {
            this._azContainerRegistryNodeClicked();
        } else if (type === 'AZAutomationAccount') {
            this._azAutomationAccountNodeClicked();
        } else if (type === 'AZLogicApp') {
            this._azLogicAppNodeClicked();
        } else if (type === 'AZFunctionApp') {
            this._azFunctionAppNodeClicked();
        } else if (type === 'AZWebApp') {
            this._azWebAppNodeClicked();
        } else if (type === 'AZManagedCluster') {
            this._azManagedClusterNodeClicked();
        } else if (type === 'AZVMScaleSet') {
            this._azVMScaleSetNodeClicked();
        } else if (type === 'AZKeyVault') {
            this._azKeyVaultNodeClicked();
        } else if (type === 'AZResourceGroup') {
            this._azResourceGroupNodeClicked();
        } else if (type === 'AZDevice') {
            this._azDeviceNodeClicked();
        } else if (type === 'AZSubscription') {
            this._azSubscriptionNodeClicked();
        } else if (type === 'AZTenant') {
            this._azTenantNodeClicked();
        } else if (type === 'AZVM') {
            this._azVMNodeClicked();
        } else if (type === 'AZServicePrincipal') {
            this._azServicePrincipalNodeClicked();
        } else if (type === 'AZApp') {
            this._azAppNodeClicked();
        } else if (type === 'Base') {
            this._baseNodeClicked();
        } else if (type === 'Container') {
            this._containerNodeClicked()
        } else if (type === 'AZManagementGroup') {
            this._azManagementGroupNodeClicked()
        } else if (type === 'AZRole') {
            this._azRoleNodeClicked()
        } else if (type === 'IPAUser') {
            this._ipaUserNodeClicked();
        } else if (type === 'IPAUserGroup') {
            this._ipaUserGroupNodeClicked();
        } else if (type === 'IPAHostGroup') {
            this._ipaHostGroupNodeClicked();
        } else if (type === 'IPANetGroup') {
            this._ipaNetGroupNodeClicked();
        } else if (type === 'IPASudo') {
            this._ipaSudoNodeClicked();
        } else if (type === 'IPASudoGroup') {
            this._ipaSudoGroupNodeClicked();
        } else if (type === 'IPASudoRule') {
            this._ipaSudoRuleNodeClicked();
        } else if (type === 'IPAHBACRule') {
            this._ipaHBACRuleNodeClicked();
        } else if (type === 'IPAHBACService') {
            this._ipaHBACServiceNodeClicked();
        } else if (type === 'IPAHBACServiceGroup') {
            this._ipaHBACServiceGroupNodeClicked();
        } else if (type === 'IPAPermission') {
            this._ipaPermissionNodeClicked();
        } else if (type === 'IPAPrivilege') {
            this._ipaPrivilegeNodeClicked();
        } else if (type === 'IPARole') {
            this._ipaRoleNodeClicked();
        } else if (type === 'IPAService') {
            this._ipaServiceNodeClicked();
        }
    }

    componentDidMount() {
        emitter.on('nodeClicked', this.nodeClickHandler.bind(this));
        emitter.on('imageupload', this.uploadImage.bind(this));
    }

    uploadImage(event) {
        let files = [];
        $.each(event.dataTransfer.files, (_, f) => {
            let buf = Buffer.alloc(12);
            let file = openSync(f.path, 'r');
            readSync(file, buf, 0, 12, 0);
            closeSync(file);
            let type = imageType(buf);
            if (type !== null && type.mime.includes('image')) {
                files.push({ path: f.path, name: f.name });
            } else {
                this.props.alert.info('{} is not an image'.format(f.name));
            }
        });
        emitter.emit('imageUploadFinal', files);
    }

    _baseNodeClicked() {
        this.clearVisible()
        this.setState({
            baseVisible: true,
            selected: 2
        });
    }

    _containerNodeClicked() {
        this.clearVisible()
        this.setState({
            containerVisible: true,
            selected: 2
        });
    }

    _userNodeClicked() {
        this.clearVisible()
        this.setState({
            userVisible: true,
            selected: 2
        });
    }

    _groupNodeClicked() {
        this.clearVisible()
        this.setState({
            groupVisible: true,
            selected: 2
        });
    }

    _computerNodeClicked() {
        this.clearVisible()
        this.setState({
            computerVisible: true,
            selected: 2
        });
    }

    _domainNodeClicked() {
        this.clearVisible()
        this.setState({
            domainVisible: true,
            selected: 2
        });
    }

    _gpoNodeClicked() {
        this.clearVisible()
        this.setState({
            gpoVisible: true,
            selected: 2
        });
    }

    _ouNodeClicked() {
        this.clearVisible()
        this.setState({
            ouVisible: true,
            selected: 2
        });
    }


    _ipaUserNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaUserVisible: true,
            selected: 2
        });
    }

    _ipaHostNodeClicked() {
        this.clearVisible()
        this.setState({
            IPAhostVisible: true,
            selected: 2
        });
    }

    _ipaUserGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaUserGroupVisible: true,
            selected: 2
        });
    }

    _ipaHostGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaHostGroupVisible: true,
            selected: 2
        });
    }

    _ipaNetGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaNetGroupVisible: true,
            selected: 2
        });
    }

    _ipaSudoNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaSudoVisible: true,
            selected: 2
        });
    }

    _ipaSudoGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaSudoGroupVisible: true,
            selected: 2
        });
    }

    _ipaSudoRuleNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaSudoRuleVisible: true,
            selected: 2
        });
    }

    _ipaHBACRuleNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaHBACRuleVisible: true,
            selected: 2
        });
    }

    _ipaHBACServiceNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaHBACServiceVisible: true,
            selected: 2
        });
    }
    
    _ipaHBACServiceGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaHBACServiceGroupVisible: true,
            selected: 2
        });
    }

    _ipaPrivilegeNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaPrivilegeVisible: true,
            selected: 2
        });
    }

    _ipaPermissionNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaPermissionVisible: true,
            selected: 2
        });
    }

    _ipaRoleNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaRoleVisible: true,
            selected: 2
        });
    }

    _ipaServiceNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaServiceVisible: true,
            selected: 2
        });
    }

    _azGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            azGroupVisible: true,
            selected: 2
        });
    }

    _azUserNodeClicked() {
        this.clearVisible()
        this.setState({
            azUserVisible: true,
            selected: 2
        });
    }

    _azContainerRegistryNodeClicked() {
        this.clearVisible()
        this.setState({
            azContainerRegistryVisible: true,
            selected: 2
        })
    }

    _azAutomationAccountNodeClicked() {
        this.clearVisible()
        this.setState({
            azAutomationAccountVisible: true,
            selected: 2
        })
    }

    _azLogicAppNodeClicked() {
        this.clearVisible()
        this.setState({
            azLogicAppVisible: true,
            selected: 2
        })
    }

    _azFunctionAppNodeClicked() {
        this.clearVisible()
        this.setState({
            azFunctionAppVisible: true,
            selected: 2
        })
    }

    _azWebAppNodeClicked() {
        this.clearVisible()
        this.setState({
            azWebAppVisible: true,
            selected: 2
        })
    }

    _azManagedClusterNodeClicked() {
        this.clearVisible()
        this.setState({
            azManagedClusterVisible: true,
            selected: 2
        })
    }

    _azVMScaleSetNodeClicked() {
        this.clearVisible()
        this.setState({
            azVMScaleSetVisible: true,
            selected: 2
        })
    }

    _azKeyVaultNodeClicked() {
        this.clearVisible()
        this.setState({
            azKeyVaultVisible: true,
            selected: 2
        });
    }

    _azResourceGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            azResourceGroupVisible: true,
            selected: 2
        });
    }

    _azManagementGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            azManagementGroupVisible: true,
            selected: 2
        });
    }

    _azRoleNodeClicked() {
        this.clearVisible()
        this.setState({
            azRoleVisible: true,
            selected: 2
        });
    }

    _azDeviceNodeClicked() {
        this.clearVisible()
        this.setState({
            azDeviceVisible: true,
            selected: 2
        });
    }

    _azSubscriptionNodeClicked() {
        this.clearVisible()
        this.setState({
            azSubscriptionVisible: true,
            selected: 2
        });
    }

    _azTenantNodeClicked() {
        this.clearVisible()
        this.setState({
            azTenantVisible: true,
            selected: 2
        });
    }

    _azVMNodeClicked() {
        this.clearVisible()
        this.setState({
            azVMVisible: true,
            selected: 2
        });
    }

    _azServicePrincipalNodeClicked() {
        this.clearVisible()
        this.setState({
            azServicePrincipalVisible: true,
            selected: 2
        });
    }

    _azAppNodeClicked() {
        this.clearVisible()
        this.setState({
            azAppVisible: true,
            selected: 2
        });
    }

    _handleSelect(index, last) {
        this.setState({ selected: index });
    }
    render() {
        return (
            <div>
                <Tabs
                    id='tabcontainer'
                    bsStyle='pills'
                    activeKey={this.state.selected}
                    onSelect={this._handleSelect.bind(this)}
                    className={styles.tc}
                >
                    <Tab eventKey={1} title='Database Info'>
                        <DatabaseDataDisplay />
                    </Tab>

                    <Tab eventKey={2} title='Node Info'>
                        <NoNodeData
                            visible={
                                !this.state.baseVisible &&
                                !this.state.containerVisible &&
                                !this.state.userVisible &&
                                !this.state.computerVisible &&
                                !this.state.groupVisible &&
                                !this.state.domainVisible &&
                                !this.state.gpoVisible &&
                                !this.state.ouVisible &&
                                !this.state.IPAhostVisible &&
                                !this.state.azGroupVisible &&
                                !this.state.azUserVisible &&
                                !this.state.azContainerRegistryVisible &&
                                !this.state.azAutomationAccountVisible &&
                                !this.state.azLogicAppVisible &&
                                !this.state.azFunctionAppVisible &&
                                !this.state.azWebAppVisible &&
                                !this.state.azManagedClusterVisible &&
                                !this.state.azVMScaleSetVisible &&
                                !this.state.azKeyVaultVisible &&
                                !this.state.azResourceGroupVisible &&
                                !this.state.azDeviceVisible &&
                                !this.state.azSubscriptionVisible &&
                                !this.state.azTenantVisible &&
                                !this.state.azVMVisible &&
                                !this.state.azServicePrincipalVisible &&
                                !this.state.azAppVisible &&
                                !this.state.baseVisible &&
                                !this.state.azManagementGroupVisible &&
                                !this.state.azRoleVisible &&
                                !this.state.ipaUserVisible &&
                                !this.state.ipaUserGroupVisible &&
                                !this.state.ipaHostGroupVisible &&
                                !this.state.ipaNetGroupVisible &&
                                !this.state.ipaSudoVisible &&
                                !this.state.ipaSudoGroupVisible &&
                                !this.state.ipaSudoRuleVisible &&
                                !this.state.ipaHBACRuleVisible &&
                                !this.state.ipaHBACServiceVisible &&
                                !this.state.ipaHBACServiceGroupVisible &&
                                !this.state.ipaPermissionVisible &&
                                !this.state.ipaPrivilegeVisible &&
                                !this.state.ipaRoleVisible &&
                                !this.state.ipaServiceVisible
                            }
                        />
                        <BaseNodeData visible={this.state.baseVisible} />
                        <UserNodeData visible={this.state.userVisible} />
                        <GroupNodeData visible={this.state.groupVisible} />
                        <ComputerNodeData
                            visible={this.state.computerVisible}
                        />
                        <DomainNodeData visible={this.state.domainVisible} />
                        <GpoNodeData visible={this.state.gpoVisible} />
                        <OuNodeData visible={this.state.ouVisible} />
                        <ContainerNodeData visible={this.state.containerVisible} />
                        <IPAHostNodeData visible={this.state.IPAhostVisible} />
                        <AZGroupNodeData visible={this.state.azGroupVisible} />
                        <AZUserNodeData visible={this.state.azUserVisible} />
                        <AZContainerRegistryNodeData visible={this.state.azContainerRegistryVisible} />
                        <AZAutomationAccountNodeData visible={this.state.azAutomationAccountVisible} />
                        <AZLogicAppNodeData visible={this.state.azLogicAppVisible} />
                        <AZFunctionAppNodeData visible={this.state.azFunctionAppVisible} />
                        <AZWebAppNodeData visible={this.state.azWebAppVisible} />
                        <AZManagedClusterNodeData visible={this.state.azManagedClusterVisible} />
                        <AZVMScaleSetNodeData visible={this.state.azVMScaleSetVisible} />
                        <AZKeyVaultNodeData
                            visible={this.state.azKeyVaultVisible}
                        />
                        <AZResourceGroupNodeData
                            visible={this.state.azResourceGroupVisible}
                        />
                        <AZDeviceNodeData
                            visible={this.state.azDeviceVisible}
                        />
                        <AZSubscriptionNodeData
                            visible={this.state.azSubscriptionVisible}
                        />
                        <AZTenantNodeData
                            visible={this.state.azTenantVisible}
                        />
                        <AZVMNodeData visible={this.state.azVMVisible} />
                        <AZServicePrincipalNodeData
                            visible={this.state.azServicePrincipalVisible}
                        />
                        <AZAppNodeData visible={this.state.azAppVisible} />
                        <AZManagementGroupNodeData visible={this.state.azManagementGroupVisible} />
                        <AZRoleNodeData visible={this.state.azRoleVisible} />
                        <IPAUserNodeData visible={this.state.ipaUserVisible} />
                        <IPAUserGroupNodeData visible={this.state.ipaUserGroupVisible} />
                        <IPAHostGroupNodeData visible={this.state.ipaHostGroupVisible} />
                        <IPANetGroupNodeData visible={this.state.ipaNetGroupVisible} />
                        <IPASudoNodeData visible={this.state.ipaSudoVisible} />
                        <IPASudoGroupNodeData visible={this.state.ipaSudoGroupVisible} />
                        <IPASudoRuleNodeData visible={this.state.ipaSudoRuleVisible} />
                        <IPAHBACRuleNodeData visible={this.state.ipaHBACRuleVisible} />
                        <IPAHBACServiceNodeData visible={this.state.ipaHBACServiceVisible} />
                        <IPAHBACServiceGroupNodeData visible={this.state.ipaHBACServiceGroupVisible} />
                        <IPAPermissionNodeData visible={this.state.ipaPermissionVisible} />
                        <IPAPrivilegeNodeData visible={this.state.ipaPrivilegeVisible} />
                        <IPARoleNodeData visible={this.state.ipaRoleVisible} />
                        <IPAServiceNodeData visible={this.state.ipaServiceVisible} />
                    </Tab>

                    <Tab eventKey={3} title='Analysis'>
                        <PrebuiltQueriesDisplay />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withAlert()(TabContainer);
