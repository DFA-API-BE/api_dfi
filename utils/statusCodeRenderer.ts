const statusCodeRenderer = (status: string) => {
  switch (status) {
    case 'EREQUEST':
      return 400;
    default:
      return 500;
  }
};

export { statusCodeRenderer };
