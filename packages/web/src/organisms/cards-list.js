import React from "react";
import { Box } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import styled from "@emotion/styled";
import Card from "./card";
import Typography from "@material-ui/core/Typography";

const CardsContainer = styled(Box)`
  text-align: center;
`;

const StyledGrid = styled(Grid)`
  flex-grow: 0;
`;

const StyledH4 = styled.h4`
  margin-bottom: 0;
`;
function CardsList({ cards, clickHandler = () => {}, title }) {
  return (
    <CardsContainer bgcolor="primary.main" color="primary.contrastText" p={2}>
      <StyledGrid container spacing={1}>
        {cards.map(({ number, type, badge }, index) => (
          <StyledGrid
            item
            xs
            key={`${number}-${type}-${Math.floor(Math.random() * 1000) + 1}-${
              Math.floor(Math.random() * 1000) + 1
            }`}
          >
            <Card
              text={number}
              type={type}
              badge={badge}
              onClick={clickHandler}
            />
          </StyledGrid>
        ))}
      </StyledGrid>
      <Typography>
        <StyledH4>{title}</StyledH4>
      </Typography>
    </CardsContainer>
  );
}

export default CardsList;
