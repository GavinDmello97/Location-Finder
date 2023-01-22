import "../App.scss";

const Generic = {
  Loader: ({ size = 30 }: { size?: number }) => {
    return <div className="loader" style={{ width: size, height: size }}></div>;
  },
};

export default Generic;
