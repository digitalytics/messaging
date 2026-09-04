import React, { useEffect, useState } from "react";
import BarChart from "../../charts/BarChart02";
import configuration from '../../config';
import { toast } from 'react-toastify';

function DashboardBarChart({ totalEarning = 0 }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    // configuration.getAPIaxios({ url: 'admin/dashboard/station-earning', params: {} }).then((result) => {
    //   if (result) {
    //     setData(result);
    //   } else {
    //     setData([]);
    //   }
    // }).catch(error => {
    //   return toast.error(error.message)
    // });
  }, []);

  const dataset = {
    datasets: [
      {
        label: "Stack 1",
        data: data,
        backgroundColor: "#45B600",
        hoverBackgroundColor: "#45B600",
        barPercentage: 0.66,
        // categoryPercentage: 0.66,
      },
    ],
  }
  return (
    <div className="rounded-lg bg-white shadow px-4 py-4">
      <header className="px-5 py-4 border-[#E1DAFC] border-b flex rounded-t-lg  items-center">
        <h2 className="admin-semibold text-gray-900">Total Earnings</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl admin-semibold text-gray-900 mr-2">{totalEarning}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        {
          data && data.length > 0 &&
          <BarChart
            options={{
              parsing: {
                xAxisKey: 'station',
                yAxisKey: 'total'
              }
            }}
            data={{ ...dataset }}
            width={595}
            height={290} />
        }

      </div>
    </div>
  );
}

export default DashboardBarChart;
