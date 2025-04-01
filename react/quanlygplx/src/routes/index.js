import LayoutDefault from "../layout/layoutDefault";
import Home from "../page/Home/index";
import Gioithieu from "../page/Gioithieu/index";
import CaplaiGPLX from "../page/CaplaiGPLX/index";
import GiahanGPLX from "../page/GiahanGPLX/index";
import TaokhoaUser from "../page/Capkhoa/index";

export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "gioithieu",
                element: <Gioithieu />,
            },
            {
                path: "caplaiGPLX",
                element: <CaplaiGPLX />,
            },
            {
                path: "giahanGPLX",
                element: <GiahanGPLX />,
            },
            {
                path: "taokhoa",
                element: <TaokhoaUser />,
            }
            
        ]
    }
];
