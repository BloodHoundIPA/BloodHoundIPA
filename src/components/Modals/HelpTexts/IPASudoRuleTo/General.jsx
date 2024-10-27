import React from 'react';
import PropTypes from 'prop-types';
import { typeFormat } from '../Formatter';

const General = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
                Sudo is a program that allows users to run programs as another user 
                with different privileges (possibly root). Sudo rules provide fine-grained 
                control over who can execute which processes, as which users. 
                FreeIPA allows centralised management of Sudo rules. To simplify management, 
                Sudo rules can refer to User Groups, Host Groups and Command Groups 
                as well as individual users, hosts and commands.
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
