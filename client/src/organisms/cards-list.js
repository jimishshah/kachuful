import React from "react";
import { Box } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import styled from "@emotion/styled";
import Card from "./card";

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
          <StyledGrid item xs key={index}>
            <Card
              text={number}
              type={type}
              badge={badge}
              onClick={clickHandler}
            />
          </StyledGrid>
        ))}
      </StyledGrid>
      <StyledH4>{title}</StyledH4>
    </CardsContainer>
  );
}

export default CardsList;
