import React, { useState, useEffect } from "react";
import { Bar,Line } from "react-chartjs-2";
import './productSales.css';
import Header from "./header";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );


const SalesGraph = () => {
  const [dailySalesData, setDailySalesData] = useState({});
  const [discountSalesData, setDiscountSalesData] = useState({});
  const [discountSalesChartData, setDiscountSalesChartData] = useState({});
  const[salesByBranch,setSalesByBranch]=useState({});
  const[description,setDescription]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/product_sales");
      if (!response.ok) {
        throw new Error("Failed to fetch sales data.");
      }

      const data = await response.json();

      // Parse `daily_sales` for one chart
      const dailyLabels = data.daily_sales.map((item) => item["Product Name"]);
      const dailySales = data.daily_sales.map((item) => item["Total Sale"]);

      setDailySalesData({
        labels: dailyLabels,
        datasets: [
          {
            label: "Total Sales",
            data: dailySales,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      // Parse `sales_upon_to_discount` for another chart
      const discountLabels = data.sales_upon_to_discount.map(
        (item) => item["Product Name"]
      );
      const discounts = data.sales_upon_to_discount.map(
        (item) => item["Discount"]
      );

      setDiscountSalesData({
        labels: discountLabels,
        datasets: [
          {
            label: "Discount",
            data: discounts,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      });

      const salesByDiscountLabels = data.sales_by_discount.map(
        (item) => item["Discount"]
      );
      const salesByDiscountData = data.sales_by_discount.map(
        (item) => item["Total Sale"]
      );
      setDiscountSalesChartData({
        labels: salesByDiscountLabels,
        datasets: [
            {
              label: "Total Sales by Discount",
              data: salesByDiscountData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4, // Smooth curve
              pointRadius: 5,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
            },
          ],
      });

      const salesByBranchLabels = data.sales_accordingto_branch.map(
        (item) => item["Branch"]
      );
      const salesByBranchData = data.sales_accordingto_branch.map(
        (item) => item["Total Sale"]
      );
      setSalesByBranch({
        labels: salesByBranchLabels,
        datasets: [
          {
            label: "Sales by Branch",
            data: salesByBranchData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
      setDescription(data.descriptionsales_data);
      
      

      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchSalesData();
    
  }, []);

  return (
    <div className="sales-graph">
      <Header />
      <h2>Sales Descriptive Statistics</h2>
      <table className="stat-table">
        <thead>
          <tr>
            <th>Statistic</th>
            <th>Total Sale</th>
          </tr>
        </thead>
        <tbody>
          {description.map((item, index) => (
            <tr key={index}>
              <td>{item.index}</td>
              <td>{item['Total Sale']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Product Sales and Discounts</h2>
      {loading && <p>Loading sales data...</p>}
      
      {error && <p className="error">Error: {error}</p>}
      {!loading &&
        !error &&
        dailySalesData &&
        Object.keys(dailySalesData).length > 0 && (
          <div className="chart-container">
            <h3>Total Sales by Product</h3>
            <Bar
              
              data={dailySalesData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                  title: { display: true, text: "Total Sales",font:{size:20},color:'white' },
                },
                scales: {
                  x: { title: { display: true, text: "Products",font:{size:20}},color:'white' },
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Sales Amount",font:{size:20},color:'white' },
                  },
                 
                },
                ticks: {
                  font: { size: 15 }, // Font size for y-axis labels
                  color: "white", // y-axis labels color
                },

              }}
            />
          </div>
        )}
      {!loading &&
        !error &&
        discountSalesData &&
        Object.keys(discountSalesData).length > 0 && (
          <div className="chart-container" style={{ marginBottom: "50px", width:'80%' }}>
            <h3>Discounts by Product</h3>
            <Bar
              
              data={discountSalesData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                  title: { display: true, text: "Discounts" },
                },
                scales: {
                  x: { title: { display: true, text: "Products" } },
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Discount Amount" },
                  },
                },
              }}
            />
          </div>
        )}
      {!loading &&
        !error &&
        discountSalesChartData &&
        Object.keys(discountSalesChartData).length > 0 && (
          <div className="chart-container" style={{ marginBottom: "50px", width:'80%' }}>
            <h3>Total Sales by Discount</h3>
            <Line
              data={discountSalesChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Total Sales by Discount",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Discount",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Total Sales",
                    },
                   
                  },
                },
              }}
            />
          </div>
        )}
        
        {!loading &&
        !error &&
        salesByBranch &&
        Object.keys(salesByBranch).length > 0 && (
          <div className="chart-container" style={{ marginBottom: "50px", width:'80%' }}>
            <h3>Total Sales by Discount</h3>
            <Bar
              data={salesByBranch}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Total Sales by Discount",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Discount",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Total Sales",
                    },
                   
                  },
                },
              }}
            />
          </div>
        )}
    </div>
  );
};

export default SalesGraph;
