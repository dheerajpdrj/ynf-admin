const Ellipsis = ({ text }: any) => {
  return (
    <span
      style={{
        cursor: "pointer",
      }}
      title={text}
    >
      {text?.slice(0, 10)}
      ...
    </span>
  );
};

export default Ellipsis;
