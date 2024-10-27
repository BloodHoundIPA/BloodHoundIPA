import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
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

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Direct Members'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[:IPAMemberOf]->(:IPASudoGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Sudo Rule Membership'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(:IPASudoGroup {objectid: $objectid})-[:IPAMemberOf]->(n:IPASudoRule)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Sudo Rule Membership Allow'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(:IPASudoGroup {objectid: $objectid})-[:IPAMemberOf {allow: true}]->(n:IPASudoRule)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Sudo Rule Membership Deny'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(:IPASudoGroup {objectid: $objectid})-[:IPAMemberOf {allow: false}]->(n:IPASudoRule)'
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
