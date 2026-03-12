const sortProducts = (products, direction = "asc") => {
  return [...products].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (direction === "asc") {
      return nameA.localeCompare(nameB);
    }
    if (direction === "desc") {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });
};

export default sortProducts;
