import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import styles from './NodeData.module.css';

const IPAUserGroupNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectid, setObjectid] = useState(null);
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
        if (type === 'IPAUserGroup') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAUserGroup {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
                    session.close();
                });
        } else {
            setObjectid(null);
            setVisible(false);
        }
    };

    const displayMap = {
        objectid: 'Object ID',
        description: 'Description',
        admincount: 'Admin Count',
    };

    return objectid === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectid}</h5>

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Roles'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(:IPAUserGroup {objectid: $objectid})-[:IPAMemberOf]->(n:IPARole )'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Permissions'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(:IPAUserGroup {objectid: $objectid})-[:IPAMemberOf]->(n:Permissions )'
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

                <CollapsibleSection header='GROUP MEMBERS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Direct Members'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[b:IPAMemberOf]->(c:IPAUserGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Member Manager'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[b:IPAMemberManager]->(c:IPAUserGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Unrolled Members'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p =(n)-[r:IPAMemberOf*1..]->(g:IPAUserGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Foreign Members'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (n)-[r:IPAMemberOf*1..]->(g:IPAUserGroup {objectid: $objectid}) WHERE NOT g.domain = n.domain'
                                    }
                                    end={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='Group Membership'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Group Membership'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(g1:IPAUserGroup {objectid: $objectid})-[r:IPAMemberOf]->(n:IPAUserGroup)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Member Of'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (g1:IPAUserGroup {objectid: $objectid})-[r:IPAMemberOf*1..]->(n:IPAUserGroup)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Foreign Group Membership'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (m:IPAUserGroup {objectid: $objectid}) MATCH (n:IPAUserGroup) WHERE NOT m.domain=n.domain MATCH p=(m)-[r:IPAMemberOf*1..]->(n)'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='LOCAL ADMIN RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Local Admin'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAUserGroup {objectid: $objectid})-[r:AdminTo]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />

                                <NodeCypherLink
                                    property='Group Delegated Local Admin Rights'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (g1:IPAUserGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g2:IPAUserGroup)-[r2:AdminTo]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />

                                <NodePlayCypherLink
                                    property='Derivative Local Admin Rights'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = shortestPath((g:IPAUserGroup {objectid: $objectid})-[r:IPAMemberOf|AdminTo|HasSession*1..]->(n:Computer))'
                                    }
                                    start={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='EXECUTION RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree RDP Privileges'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAUserGroup {objectid: $objectid})-[r:CanRDP]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated RDP Privileges'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAUserGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g:IPAUserGroup)-[r2:CanRDP]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='First Degree DCOM Privileges'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAUserGroup {objectid: $objectid})-[r:ExecuteDCOM]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated DCOM Privileges'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAUserGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g:IPAUserGroup)-[r2:ExecuteDCOM]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='OUTBOUND OBJECT CONTROL'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Object Control'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (g:IPAUserGroup {objectid: $objectid})-[r]->(n) WHERE r.isacl=true'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated Object Control'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (g1:IPAUserGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g2:IPAUserGroup)-[r2]->(n) WHERE r2.isacl=true'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Control'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((g:IPAUserGroup {objectid: $objectid})-[r:IPAMemberOf|AddSelf|WriteSPN|AddKeyCredentialLink|AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->(n))'
                                    }
                                    start={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='INBOUND CONTROL RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Explicit Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (n)-[r:AddMember|AddSelf|WriteSPN|AddKeyCredentialLink|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns]->(g:IPAUserGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (n)-[r:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r1]->(g2:IPAUserGroup {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = g2.objectid) AND NOT n.objectid = g2.objectid AND r1.isacl=true'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((n)-[r:IPAMemberOf|AddSelf|WriteSPN|AddKeyCredentialLink|AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->(g:IPAUserGroup {objectid: $objectid}))'
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
                                    target={objectid}
                                    countQuery={
                                        'MATCH (g:IPAUserGroup {objectid: $objectid}) MATCH (n:IPASudoRule) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN count(n)'
                                    }
                                    graphQuery={
                                        'MATCH (g:IPAUserGroup {objectid: $objectid}) MATCH (n:IPASudoRule) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Enabled Sudo Rule'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (g:IPAUserGroup {objectid: $objectid}) MATCH (n:IPASudoRule {ipaenabledflag: true}) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN count(n)'
                                    }
                                    graphQuery={
                                        'MATCH (g:IPAUserGroup {objectid: $objectid}) MATCH (n:IPASudoRule {ipaenabledflag: true}) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAUserGroup)-[r3:IPASudoRuleTo]->(n) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                {/*  <Notes objectid={objectid} type='Group' />
                 <NodeGallery
                     objectid={objectid}
                     type='Group'
                     visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAUserGroupNodeData.propTypes = {};
export default IPAUserGroupNodeData;
