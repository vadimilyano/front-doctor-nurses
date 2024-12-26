import React from 'react';
import Table from './Table';

const Nurses: React.FC = () => {
    return (
        <Table name='nurses' isDoctor={false} />
    );
};

export default Nurses;