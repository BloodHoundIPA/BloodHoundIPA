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

const IPAHBACServiceNodeData = () => {
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
        if (type === 'IPAHBACService') {
            setVisible(true);
            setObjectId(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAHBACService {objectid: $objectid}) RETURN n AS node`, {
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
        description: 'Description',
        highvalue: 'High Value',
        name: 'Name',
        objectclass: 'Object Class',        
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

                <CollapsibleSection header='MEMBER OF'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='HBAC Groups'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAHBACService {objectid: $objectid})-[:IPAMemberOf]->(n:IPAHBACServiceGroup)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Enabled HBAC Rules'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAHBACService {objectid: $objectid})-[:IPAMemberOf*1..]->(n:IPAHBACRule) WHERE n.ipaenabledflag=true'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Disabled HBAC Rules'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAHBACService {objectid: $objectid})-[:IPAMemberOf*1..]->(n:IPAHBACRule) WHERE n.ipaenabledflag=false'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>                

                {/* <Notes objectid={objectId} type={'IPAHBACService'} />
                <NodeGallery
                    objectid={objectId}
                    type={'IPAHBACService'}
                    visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAHBACServiceNodeData.propTypes = {};
export default withAlert()(IPAHBACServiceNodeData);