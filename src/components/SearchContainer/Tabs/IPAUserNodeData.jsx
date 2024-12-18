import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import CollapsibleSection from './Components/CollapsibleSection';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherNoNumberLink from './Components/NodeCypherNoNumberLink';
import MappedNodeProps from './Components/MappedNodeProps';
import ExtraNodeProps from './Components/ExtraNodeProps';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import { withAlert } from 'react-alert';
import { Table } from 'react-bootstrap';
import styles from './NodeData.module.css';
import { useContext } from 'react';
import { AppContext } from '../../../AppContext';

const IPAUserNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectId, setObjectId] = useState(null);
    const [label, setLabel] = useState(null);
    const [domain, setDomain] = useState(null);
    const [nodeProps, setNodeProps] = useState({});
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('nodeClicked', nodeClickEvent);

        return () => {
            emitter.removeListener('nodeClicked', nodeClickEvent);
        };
    }, []);

    const nodeClickEvent = (type, id, blocksinheritance, domain) => {
        if (type === 'IPAUser') {
            setVisible(true);
            setObjectId(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAUser {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
                    session.close();
                });
        } else {
            setObjectId(null);
            setVisible(false);
        }
    };

    const displayMap = {
        displayname: 'Display Name',
        objectid: 'Object ID',
        pwdlastset: 'Password Last Changed',
        lastlogon: 'Last Logon',
        lastlogontimestamp: 'Last Logon (Replicated)',
        enabled: 'Enabled',
        email: 'Email',
        title: 'Title',
        homedirectory: 'Home Directory',
        description: 'Description',
        userpassword: 'User Password',
        admincount: 'AdminCount',
        owned: 'Compromised',
        pwdneverexpires: 'Password Never Expires',
        sensitive: 'Cannot Be Delegated',
        dontreqpreauth: 'ASREP Roastable',
        serviceprincipalnames: 'Service Principal Names',
        allowedtodelegate: 'Allowed To Delegate',
        sidhistory: 'SID History',
        
        cn: "CN",
        dn: 'DN',
        gecos: 'GECOS',
        gidnumber: 'GID Number',
        givenname: 'Given Name',
        highvalue: 'High Value',
        initials: 'Initials',
        ipauniqueid: 'IPA Unique ID',
        krbcanonicalname: 'Kerberos Canonical Name',
        krblastpwdchange: 'Kerberos Last Password Change',
        krbpasswordexpiration: 'Kerberos Password Expiration',
        krbprincipalname: 'Kerberos Principal Name',
        krblastadminunlock: 'Kerberos Last Admin Unlock',
        krblastfailedauth: 'Kerberos Failed Authentication',
        krbloginfailedcount: 'Kerberos Login Failed Count',
        loginshell: 'Login Shell',
        mail: 'Email',
        memberof_group: 'Memberof Group',
        memberof_netgroup: 'Memberof Netgroup',
        memberof_role: 'Memberof Role',
        memberof_sudorule: 'Memberof Sudorule',
        name: 'Name',
        objectclass: 'Object Class',
        preserved: 'Preserved',
        sn: 'Second Name',
        uid: 'UID',
        uidnumber: 'UID Number',
        nsaccountlock: 'NS Account Lock'
        
    };

    return objectId === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectId}</h5>

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='User Groups'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPAUserGroup)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Net Groups'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPANetGroup)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Roles'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPARole)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Permissions'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPAPermission)'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <MappedNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <ExtraNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <CollapsibleSection header={'GROUP MEMBERSHIP'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Group Memberships'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH (m:IPAUser {objectid: $objectid}), (n:Group), p=(m)-[:MemberOf]->(n)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Unrolled Group Membership'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p = (m:IPAUser {objectid: $objectid})-[r:MemberOf*1..]->(n:Group)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Foreign Group Membership'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH (m:IPAUser {objectid: $objectid}) MATCH (n:Group) WHERE NOT m.domain=n.domain MATCH p=(m)-[r:MemberOf*1..]->(n)'
                                    }
                                    start={label}
                                    domain={domain}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'LOCAL ADMIN RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Local Admin'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r:AdminTo]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated Local Admin Rights'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r1:MemberOf*1..]->(g:Group)-[r2:AdminTo]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Derivative Local Admin Rights'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=shortestPath((m:IPAUser {objectid: $objectid})-[r:HasSession|AdminTo|MemberOf*1..]->(n:Computer))'
                                    }
                                    start={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'EXECUTION RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree RDP Privileges'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r:CanRDP]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated RDP Privileges'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r1:MemberOf*1..]->(g:Group)-[r2:CanRDP]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='First Degree DCOM Privileges'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r:ExecuteDCOM]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated DCOM Privileges'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r1:MemberOf*1..]->(g:Group)-[r2:ExecuteDCOM]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='SQL Admin Rights'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r:SQLAdmin]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Constrained Delegation Privileges'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[r:AllowedToDelegate]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'OUTBOUND OBJECT CONTROL'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Object Control'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(u:IPAUser {objectid: $objectid})-[r1]->(n) WHERE r1.isacl=true'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated Object Control'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(u:IPAUser {objectid: $objectid})-[r1:MemberOf*1..]->(g:Group)-[r2]->(n) WHERE r2.isacl=true'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Control'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid MATCH p=shortestPath((u:IPAUser {objectid: $objectid})-[r1:MemberOf|AddSelf|WriteSPN|AddKeyCredentialLink|AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->(n))'
                                    }
                                    start={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'INBOUND CONTROL RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Explicit Object Controllers'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(n)-[r]->(u1:IPAUser {objectid: $objectid}) WHERE r.isacl=true'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Object Controllers'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(n)-[r:MemberOf*1..]->(g:Group)-[r1:AddMember|AddSelf|WriteSPN|AddKeyCredentialLink|AllExtendedRights|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns]->(u:IPAUser {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = u.objectid) AND NOT n.objectid = u.objectid'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Controllers'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid MATCH p = shortestPath((n)-[r1:MemberOf|AddSelf|WriteSPN|AddKeyCredentialLink|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner*1..]->(u1:IPAUser {objectid: $objectid}))'
                                    }
                                    end={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'SUDO RULE'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLinkComplex
                                    property='All Sudo Rule'
                                    target={objectId}
                                    countQuery={
                                        'MATCH (u:IPAUser {objectid: $objectid}) MATCH (n:IPASudoRule) WITH u,n OPTIONAL MATCH p1=(u)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(u)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN count(n)'
                                    }
                                    graphQuery={
                                        'MATCH (u:IPAUser {objectid: $objectid}) MATCH (n:IPASudoRule) WITH u,n OPTIONAL MATCH p1=(u)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(u)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Enabled Sudo Rule'
                                    target={objectId}
                                    countQuery={
                                        'MATCH (u:IPAUser {objectid: $objectid}) MATCH (n:IPASudoRule {ipaenabledflag: true}) WITH u,n OPTIONAL MATCH p1=(u)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(u)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN count(n)'
                                    }
                                    graphQuery={
                                        'MATCH (u:IPAUser {objectid: $objectid}) MATCH (n:IPASudoRule {ipaenabledflag: true}) WITH u,n OPTIONAL MATCH p1=(u)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(u)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                {/* <Notes objectid={objectId} type={'IPAUser'} />
                <NodeGallery
                    objectid={objectId}
                    type={'IPAUser'}
                    visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAUserNodeData.propTypes = {};
export default withAlert()(IPAUserNodeData);
