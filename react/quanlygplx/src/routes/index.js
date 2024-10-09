import LayoutDefault from "../layout/layoutDefault"
import Home from "../page/Home/index"
import Gioithieu from "../page/Gioithieu/index"
import CaplaiGPLX from "../page/CaplaiGPLX/index"
import GiahanGPLX from "../page/GiahanGPLX/index"
import Test from "../page/GiahanGPLX/Test"

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
          path: "Gioithieu",
          element: <Gioithieu />,
        },
        {
          path: "CaplaiGPLX",
          element: <CaplaiGPLX />,
        },
       
        {
          path: "GiahanGPLX",
          element: <GiahanGPLX />,
        },
        {
          path: "Test",
          element: <Test />,
        },
        ]
    }
]