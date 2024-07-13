import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';

const Breadcrum = (props) => {
  const { product = {} } = props;
  const { category = 'Category', name = 'Product' } = product;

  return (
    <div>
      <div className="breadcrum">
        HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {category} <img src={arrow_icon} alt="" /> {name}
      </div>
    </div>
  );
};

export default Breadcrum;

