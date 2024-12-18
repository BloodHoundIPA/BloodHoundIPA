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

const IPAHostGroupNodeData = () => {
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
        if (type === 'IPAHostGroup') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAHostGroup {objectid: $objectid}) RETURN n AS node`, {
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
                                    property='Sessions'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (c:Computer)-[n:HasSession]->(u:User)-[r2:MemberOf*1..]->(g:Group {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Reachable High Value Targets'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (m:Group {objectid: $objectid}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NONE (r IN relationships(p) WHERE type(r)= "GetChanges") AND NONE (r in relationships(p) WHERE type(r)="GetChangesAll") AND NOT m=n'
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
                                        'MATCH p=(n)-[b:IPAMemberOf]->(c:IPAHostGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Member Manager'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[b:IPAMemberManager]->(c:IPAHostGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Unrolled Members'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p =(n)-[r:IPAMemberOf*1..]->(g:IPAHostGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Foreign Members'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (n)-[r:IPAMemberOf*1..]->(g:IPAHostGroup {objectid: $objectid}) WHERE NOT g.domain = n.domain'
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
                                        'MATCH p=(g1:IPAHostGroup {objectid: $objectid})-[r:IPAMemberOf]->(n:IPAHostGroup)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Member Of'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (g1:IPAHostGroup {objectid: $objectid})-[r:IPAMemberOf*1..]->(n:IPAHostGroup)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Foreign Group Membership'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (m:IPAHostGroup {objectid: $objectid}) MATCH (n:IPAHostGroup) WHERE NOT m.domain=n.domain MATCH p=(m)-[r:IPAMemberOf*1..]->(n)'
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
                                        'MATCH p=(m:IPAHostGroup {objectid: $objectid})-[r:AdminTo]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />

                                <NodeCypherLink
                                    property='Group Delegated Local Admin Rights'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (g1:IPAHostGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g2:IPAHostGroup)-[r2:AdminTo]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />

                                <NodePlayCypherLink
                                    property='Derivative Local Admin Rights'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = shortestPath((g:IPAHostGroup {objectid: $objectid})-[r:IPAMemberOf|AdminTo|HasSession*1..]->(n:Computer))'
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
                                        'MATCH p=(m:IPAHostGroup {objectid: $objectid})-[r:CanRDP]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated RDP Privileges'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAHostGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g:IPAHostGroup)-[r2:CanRDP]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='First Degree DCOM Privileges'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAHostGroup {objectid: $objectid})-[r:ExecuteDCOM]->(n:Computer)'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated DCOM Privileges'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(m:IPAHostGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g:IPAHostGroup)-[r2:ExecuteDCOM]->(n:Computer)'
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
                                        'MATCH p = (g:IPAHostGroup {objectid: $objectid})-[r]->(n) WHERE r.isacl=true'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated Object Control'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (g1:IPAHostGroup {objectid: $objectid})-[r1:IPAMemberOf*1..]->(g2:IPAHostGroup)-[r2]->(n) WHERE r2.isacl=true'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Control'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((g:IPAHostGroup {objectid: $objectid})-[r:IPAMemberOf|AddSelf|WriteSPN|AddKeyCredentialLink|AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->(n))'
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
                                        'MATCH p = (n)-[r:AddMember|AddSelf|WriteSPN|AddKeyCredentialLink|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns]->(g:IPAHostGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p = (n)-[r:IPAMemberOf*1..]->(g1:IPAHostGroup)-[r1]->(g2:IPAHostGroup {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = g2.objectid) AND NOT n.objectid = g2.objectid AND r1.isacl=true'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((n)-[r:IPAMemberOf|AddSelf|WriteSPN|AddKeyCredentialLink|AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->(g:IPAHostGroup {objectid: $objectid}))'
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
                                        'MATCH (g:IPAHostGroup {objectid: $objectid}) MATCH (n:IPASudoRule) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAHostGroup)-[r3:IPASudoRuleTo]->(n) RETURN count(n)'
                                    }
                                    graphQuery={
                                        'MATCH (g:IPAHostGroup {objectid: $objectid}) MATCH (n:IPASudoRule) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAHostGroup)-[r3:IPASudoRuleTo]->(n) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Enabled Sudo Rule'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (g:IPAHostGroup {objectid: $objectid}) MATCH (n:IPASudoRule {ipaenabledflag: true}) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAHostGroup)-[r3:IPASudoRuleTo]->(n) RETURN count(n)'
                                    }
                                    graphQuery={
                                        'MATCH (g:IPAHostGroup {objectid: $objectid}) MATCH (n:IPASudoRule {ipaenabledflag: true}) WITH g,n OPTIONAL MATCH p1=(g)-[r1:IPASudoRuleTo]->(n) OPTIONAL MATCH p2=(g)-[r2:IPAMemberOf*1..]->(g1:IPAHostGroup)-[r3:IPASudoRuleTo]->(n) RETURN p1,p2'
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

IPAHostGroupNodeData.propTypes = {};
export default IPAHostGroupNodeData;
