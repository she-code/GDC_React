import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formData } from "../../types/formTypes";

export const ShowNotification = (props: { state: formData }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!props.state) {
      return;
    }
    if (mounted) {
      notify();
    } else {
      setMounted(true);
    }
  }, [mounted, props.state]);

  const notify = () =>
    toast.info("Your responses are automatically saved", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  return null;
};
