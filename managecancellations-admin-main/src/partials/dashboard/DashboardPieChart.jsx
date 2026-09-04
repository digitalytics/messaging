import React, { useEffect, useState } from "react";
import DoughnutChart from "../../charts/DoughnutChart";
import configuration from '../../config';
import { toast } from 'react-toastify';
import { generateRandomColor } from "../../Utils/common";

function DashboardCard06() {
  const [data1, setData1] = useState([]);
  const [labels, setLabels] = useState([]);
  const colorCodes = generateRandomColor(data1.length);
  useEffect(() => {
    // configuration.getAPIaxios({ url: 'admin/dashboard/station-location', params: {} }).then((data2) => {
    //   if (data2) {
    //     setData1(data2.data);
    //     setLabels(data2.labels);
    //   } else {
    //     setData1([]);
    //     setLabels([]);
    //   }
    // }).catch(error => {
    //   return toast.error(error.message)
    // });
  }, []);

  return (
    <div className="rounded-lg bg-white shadow px-4 py-4">
      <header className="px-5 py-4 border-[#E1DAFC] border-b flex rounded-t-lg  items-center">
        <h2 className="admin-semibold text-gray-900">Top 5 Charging Stations by Usage</h2>
      </header>
      {
        (data1 && labels)  && (data1.length > 0 && labels.length > 0) &&
        <DoughnutChart
        data={{
          labels: labels,
          datasets: [
            {
              label: "Charging Station",
              data: data1,
              backgroundColor: colorCodes,
              hoverBackgroundColor: colorCodes,
            },
          ],
        }}
        width={389}
        height={245}
      />
      }
     
    </div>
  );
}

export default DashboardCard06;
