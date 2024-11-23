import React from 'react';

const BillFormat = ({ shopName, billNo, date, customerName, email, address, products, totalAmount }) => {

  console.log("{ shopName, billNo, date, customerName, email, address, products }", { shopName, billNo, date, customerName, email, address, products, totalAmount });
  const totalPrice = products?.reduce((total, product) => total + (product.quantity * product.price * product.packageType.name), 0);
  const tax = 0;
  const deliveryCharges = totalAmount - totalPrice

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", width: "70%", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: "0", color: "#00539C" }}>TIGER HILLS AGRO</h1>
        <p style={{ margin: "0" }}>VP: Nand</p>
        <p style={{ margin: "0" }}>Pushkar, Ajmer, Rajasthan</p>
      </div>

      {/* Billing Information */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <tbody>
          <tr>
            <td style={{ padding: "8px", backgroundColor: "#E8F5F9", fontWeight: "bold" }}>Bill To:</td>
            <td style={{ padding: "8px", backgroundColor: "#E8F5F9", fontWeight: "bold", textAlign: "right" }}>
              Invoice Date
            </td>
            <td style={{ padding: "8px", backgroundColor: "#E8F5F9" }}>{date}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", verticalAlign: "top" }}>
              {customerName}
              <br />
              {address}
              <br />
              {email}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#00539C", color: "#fff" }}>Product Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#00539C", color: "#fff" }}>
            Package Quantity
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#00539C", color: "#fff" }}>
              Quantity
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#00539C", color: "#fff" }}>
              Rate
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#00539C", color: "#fff" }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item?.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.packageType.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.quantity}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{(item.packageType.name * item.price)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{(item.packageType.name * item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" style={{ padding: "8px", textAlign: "right", fontWeight: "bold" }}>
              Subtotal
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{totalPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="5" style={{ padding: "8px", textAlign: "right", fontWeight: "bold" }}>
              Delivery charges
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{deliveryCharges}</td>
          </tr>
          <tr>
            <td colSpan="5" style={{ padding: "8px", textAlign: "right", fontWeight: "bold" }}>
              Tax
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="5" style={{ padding: "8px", textAlign: "right", fontWeight: "bold", backgroundColor: "#00539C", color: "#fff" }}>
              Total
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#00539C", color: "#fff" }}>
              ₹{totalAmount}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p style={{ fontWeight: "bold", margin: "0" }}>Thank you for your business!</p>
      </div>
    </div>
  )

  // return (
  //   <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
  //     <div style={{ textAlign: "center" }}>
  //       <h1>{billNo}</h1>
  //       <h1>{shopName}</h1>
  //       <p>Pushkar, Ajmer, Rajasthan</p>
  //     </div>

  //     <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
  //       <tbody>
  //         <tr>
  //           <th style={{ textAlign: "left", border: "1px solid #ddd", padding: "8px" }}>Bill To:</th>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>
  //             {customerName}<br />
  //             {address}<br />
  //             {email}<br />
  //           </td>
  //           <th style={{ textAlign: "left", border: "1px solid #ddd", padding: "8px" }}>Invoice Date</th>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>{date}</td>
  //         </tr>
  //         {/* <tr>
  //           <th style={{ textAlign: "left", border: "1px solid #ddd", padding: "8px" }}></th>
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}></th>
  //           <th style={{ textAlign: "left", border: "1px solid #ddd", padding: "8px" }}>Due Date</th>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>{date}</td>
  //         </tr> */}
  //         {/* <tr>
  //           <th style={{ textAlign: "left", border: "1px solid #ddd", padding: "8px" }}></th>
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}></th>
  //           <th style={{ textAlign: "left", border: "1px solid #ddd", padding: "8px" }}>Customer GSTN</th>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>{"customerGSTN"}</td>
  //         </tr> */}
  //       </tbody>
  //     </table>

  //     <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
  //       <thead>
  //         <tr>
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Name</th>
  //           {/* <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}>SAC Code</th> */}
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}>Package Quantity</th>
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity</th>
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}>Rate</th>
  //           <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {products.map((item, index) => (
  //           <tr key={index}>
  //             <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item?.name}</td>
  //             {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.description}</td>
  //             <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.sacCode}</td> */}
  //             <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.packageType.name}</td>
  //             <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.quantity}</td>
  //             <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{(item.packageType.name * item.price)}</td>
  //             <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{(item.packageType.name * item.price * item.quantity)}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //       <tfoot>
  //         <tr>
  //           <td colSpan="5" style={{ textAlign: "right", padding: "8px", fontWeight: "bold" }}>Subtotal</td>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{totalPrice}</td>
  //         </tr>
  //         {/* <tr>
  //           <td colSpan="5" style={{ textAlign: "right", padding: "8px", fontWeight: "bold" }}>Tax Rate</td>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taxRate}%</td>
  //         </tr> */}
  //         <tr>
  //           <td colSpan="5" style={{ textAlign: "right", padding: "8px", fontWeight: "bold" }}>Tax</td>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{tax.toFixed(2)}</td>
  //         </tr>
  //         <tr>
  //           <td colSpan="5" style={{ textAlign: "right", padding: "8px", fontWeight: "bold" }}>Total</td>
  //           <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{total.toFixed(2)}</td>
  //         </tr>
  //       </tfoot>
  //     </table>

  //     <div style={{ marginTop: "20px" }}>
  //       <h3>Payment Options</h3>
  //       <p>Bank account name: {"paymentOptions.accountName"}</p>
  //       <p>Account number: {"paymentOptions.accountNumber"}</p>
  //       <p>Bank name: {"paymentOptions.bankName"}</p>
  //       <p>IFSC Code: {"paymentOptions.ifscCode"}</p>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="container" style={{ width: '210mm', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
  //     <div className="shop-name" style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>{shopName}</div>
  //     <div className="bill-details" style={{ marginBottom: '20px' }}>
  //       <div><strong>Bill No:</strong> {billNo}</div>
  //       <div><strong>Date:</strong> {date}</div>
  //     </div>
  //     <div className="customer-details" style={{ marginBottom: '20px' }}>
  //       <div><strong>Customer Name:</strong> {customerName}</div>
  //       <div><strong>Email:</strong> {email}</div>
  //       <div><strong>Address:</strong> {address}</div>
  //     </div>
  //     <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
  //       <thead>
  //         <tr>
  //           <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Product</th>
  //           <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Quantity</th>
  //           <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Price</th>
  //           <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Total</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {products?.map((product, index) => (
  //           <tr key={index}>
  //             <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.name}</td>
  //             <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.quantity}</td>
  //             <td style={{ border: '1px solid #ccc', padding: '8px' }}>${product.price.toFixed(2)}</td>
  //             <td style={{ border: '1px solid #ccc', padding: '8px' }}>${(product.quantity * product.price).toFixed(2)}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //       <tfoot>
  //         <tr>
  //           <td colSpan="3" className="total" style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>Total</td>
  //           <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>${totalPrice?.toFixed(2)}</td>
  //         </tr>
  //       </tfoot>
  //     </table>
  //     <div><strong>Thank you for shopping with us!</strong></div>
  //   </div>
  // );
};

export default BillFormat;
