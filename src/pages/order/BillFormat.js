import React from 'react';

const BillFormat = ({ shopName, billNo, date, customerName, email, address, products }) => {
  const totalPrice = products?.reduce((total, product) => total + (product.quantity * product.price), 0);

  return (
    <div className="container" style={{ width: '210mm', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className="shop-name" style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>{shopName}</div>
      <div className="bill-details" style={{ marginBottom: '20px' }}>
        <div><strong>Bill No:</strong> {billNo}</div>
        <div><strong>Date:</strong> {date}</div>
      </div>
      <div className="customer-details" style={{ marginBottom: '20px' }}>
        <div><strong>Customer Name:</strong> {customerName}</div>
        <div><strong>Email:</strong> {email}</div>
        <div><strong>Address:</strong> {address}</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Product</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Quantity</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Price</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.quantity}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>${product.price.toFixed(2)}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>${(product.quantity * product.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="total" style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>Total</td>
            <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>${totalPrice?.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <div><strong>Thank you for shopping with us!</strong></div>
    </div>
  );
};

export default BillFormat;
