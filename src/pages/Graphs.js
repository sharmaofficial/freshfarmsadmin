import { Card } from "antd"
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const sampleData = [
    {
        month: "January",
        orders:100,    
    },
    {
        month: "February",
        orders:203,    
    },
    {
        month: "March",
        orders:107,    
    },
    {
        month: "April",
        orders:48,    
    },
    {
        month: "May",
        orders:210,    
    },
    {
        month: "June",
        orders:264,    
    },
    {
        month: "July",
        orders:111,    
    },
    {
        month: "August",
        orders:211,    
    },
    {
        month: "September",
        orders:321,    
    },
    {
        month: "October",
        orders:151,    
    },
    {
        month: "November",
        orders:111,    
    },
    {
        month: "December",
        orders:131,    
    },
]

const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  };

  const itemStyle = {
    flex: '0 0 48%',
    margin: '10px',
    backgroundColor: '#fff',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    height:'500px'
  };

const Graph =() =>{
   return(
    <div style={containerStyle}> 
    <div style={itemStyle}>
        <ResponsiveContainer width='100%' height={450}>
            <BarChart
                // width={500}
                // height={300}
                data={sampleData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 100,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"   tickSize={15} interval={0} tick={{ angle: -45, dx: -10, dy:20 }}/>
                <YAxis/>
                <Tooltip/>
                <Legend verticalAlign="top" height={36} style={{textAlign:'end'}}/>
                <Bar dataKey="orders" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />}/>
            </BarChart>
        </ResponsiveContainer>
    </div>
    <Card style={itemStyle}>card 1</Card>
    <Card style={itemStyle}>card 1</Card>
    <Card style={itemStyle}>card 1</Card>
    </div>
    )
}

export default Graph