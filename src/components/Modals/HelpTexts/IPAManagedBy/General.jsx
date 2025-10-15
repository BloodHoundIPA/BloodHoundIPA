import React from 'react';
import PropTypes from 'prop-types';
import { typeFormat } from '../Formatter';

const General = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
                The "Managed By" field in FreeIPA specifies which hosts 
                or systems are authorized to manage a particular host or service within the domain. 
                It is part of FreeIPA's role-based access control (RBAC) system, 
                enabling delegation of administrative tasks. For hosts, 
                it indicates which systems can perform actions like registering the host or managing its keys. 
                For services, it defines which hosts can manage certificates or Kerberos principals for that service. 
                This field enhances security and automation by restricting management rights to designated hosts.
            </p>
        </>
    );
};

General.propTypes = {
    sourceName: PropTypes.string,
    sourceType: PropTypes.string,
    targetName: PropTypes.string,
};

export default General;
