import LayoutDefault from "../layout/layoutDefault"
import Home from "../page/Home/index"
import Gioithieu from "../page/Gioithieu/index"
import CaplaiGPLX from "../page/CaplaiGPLX/index"
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
        ]
    }
]