import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import styles from './NodeData.module.css';

const IPASudoGroupNodeData = () => {
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
        if (type === 'IPASudoGroup') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPASudoGroup {objectid: $objectid}) RETURN n AS node`, {
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
        name: 'Name',
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

                <CollapsibleSection header='MEMBER'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Sudo Commands'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPASudo)-[r:IPAMemberOf]->(g:IPASudoGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='MEMBER OF'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLinkComplex
                                    property='Allow Sudo Rules'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (s:IPASudoGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAMemberOf {allow: true}]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..]->(g2:IPASudoGroup)-[r3:IPAMemberOf {allow: true}]->(n1:IPASudoRule) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPASudoGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAMemberOf {allow: true}]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..]->(g2:IPASudoGroup)-[r3:IPAMemberOf {allow: true}]->(n1:IPASudoRule) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Deny Sudo Rules'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (s:IPASudoGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAMemberOf {allow: false}]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..]->(g2:IPASudoGroup)-[r3:IPAMemberOf {allow: false}]->(n1:IPASudoRule) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPASudoGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAMemberOf {allow: false}]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..]->(g2:IPASudoGroup)-[r3:IPAMemberOf {allow: false}]->(n1:IPASudoRule) RETURN p1,p2'
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

IPASudoGroupNodeData.propTypes = {};
export default IPASudoGroupNodeData;
