import React, { useState, useEffect, useRef } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import axios from "axios";
import { useSelector } from "react-redux";
import SideBar from "../SideBar";
import AccountMenu from "../../../components/AccountMenu";
import { IoIosMenu, IoMdArrowBack } from "react-icons/io";

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Calendar = () => {
  const [data, setData] = useState([]);
  const scheduleRef = useRef(null);
  const { currentUser, currentRole } = useSelector((state) => state.user);

  useEffect(() => {
    axios
      .get("http://localhost:4000/events/" + currentUser._id)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  }, []);

  const change = (args) => {
    const scheduleObj = scheduleRef.current;
    if (scheduleObj) {
      scheduleObj.selectedDate = args.value;
      scheduleObj.dataBind();
    }
  };

  const onDragStart = (arg) => {
    arg.navigation.enable = true;
  };

  const onActionBegin = (args) => {
    if (args.requestType === "eventCreate") {
      axios
        .post("http://localhost:4000/events", {
          ...args.data[0],
          userType: currentRole.toLowerCase(),
          userId: currentUser._id,
        })
        .then((response) => {
          setData([...data, response.data]);
        })
        .catch((error) => {
          console.error("There was an error creating the event!", error);
        });
    } else if (args.requestType === "eventChange") {
      axios
        .put(`http://localhost:4000/events/${args.data.Id}`, args.data)
        .then((response) => {
          setData(
            data.map((event) =>
              event.Id === response.data.Id ? response.data : event
            )
          );
        })
        .catch((error) => {
          console.error("There was an error updating the event!", error);
        });
    } else if (args.requestType === "eventRemove") {
      axios
        .delete(`http://localhost:4000/events/${args.data[0].Id}`)
        .then(() => {
          setData(data.filter((event) => event.Id !== args.data[0].Id));
        })
        .catch((error) => {
          console.error("There was an error deleting the event!", error);
        });
    }
  };
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-screen font-poppins">
        <div className="flex items-center z-50  justify-between h-16 px-6 bg-white shadow-md">
          <button
            onClick={toggleDrawer}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            {open ? <IoMdArrowBack /> : <IoIosMenu />}
          </button>
          <span className="text-lg font-semibold">Super Admin Dashboard</span>
          <AccountMenu />
        </div>
        <div className="flex flex-1">
          <div>
            <div
              className={`bg-white shadow-md transition-transform ${
                open ? "w-64" : "w-0"
              } overflow-hidden`}
            >
              <SideBar />
            </div>
          </div>
          <div className="p-2 md:p-10 bg-white rounded-3xl">
            <h1>Calendar</h1>
            <ScheduleComponent
              height="650px"
              ref={scheduleRef}
              selectedDate={new Date()}
              eventSettings={{ dataSource: data }}
              dragStart={onDragStart}
              actionBegin={onActionBegin}
            >
              <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="Week" />
                <ViewDirective option="WorkWeek" />
                <ViewDirective option="Month" />
              </ViewsDirective>
              <Inject
                services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]}
              />
            </ScheduleComponent>
            <PropertyPane>
              <table style={{ width: "100%", background: "white" }}>
                <tbody>
                  <tr style={{ height: "50px" }}>
                    <td style={{ width: "100%" }}>
                      <DatePickerComponent
                        value={new Date()}
                        showClearButton={false}
                        placeholder="Current Date"
                        floatLabelType="Always"
                        change={change}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </PropertyPane>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
