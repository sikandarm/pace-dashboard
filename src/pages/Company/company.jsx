import React, { useState, useEffect } from "react";
import ApiCall from "../../utils/apicall";
import { Helmet } from "react-helmet-async";
import { Container, Stack, Typography, Breadcrumbs } from "@mui/material";
import { HomeRounded } from "@material-ui/icons";

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "fax", label: "Fax", alignRight: false },
];
const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const response = await ApiCall.get("/company");
      setCompanies(response.data.data.companies);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleFilterNameChange = (e) => {
    setFilterName(e.target.value);
  };

  return (
    <div>
      <Helmet>
        <title>Companies | Pace Companies</title>
      </Helmet>
      <div>
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Stack direction="row" alignItems="center" spacing={1}>
                <HomeRounded color="inherit" />
                <Typography variant="body1" color="textPrimary">
                  / Companies
                </Typography>
              </Stack>
            </Breadcrumbs>
          </Stack>
          <input
            type="text"
            placeholder="Search by name"
            value={filterName}
            onChange={handleFilterNameChange}
          />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {companies && companies.length > 0 ? (
                companies.map((company) => (
                  <li key={company.id}>
                    {company.name}
                    <button>Delete</button>
                  </li>
                ))
              ) : (
                <p>No companies found.</p>
              )}
            </ul>
          )}
        </Container>
      </div>
    </div>
  );
};

export default CompanyList;
