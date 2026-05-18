import styled from 'styled-components';
import '../../styles/icons.css';

// с кругом
const CustActionButton = styled.button`
  width: 32px;
  height: 32px;
  background-color: var(--add-color); // круг
  border-radius: 50%;
  border: none;
  flex-shrink: 0;
`;

const Icon = styled.span`
  font-family: 'icomoon';
  speak: never;
  color: var(--text-color);
  font-size: ${props => props.size || '16px'};
`;

// без
export const IconButton = styled.button`
  font-family: 'icomoon';
  speak: never;
  border: none;
  background: none;
  padding: 0;
  color: var(--text-color);
  font-size: ${props => props.size || '20px'};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: var(--primary-color);
  }

  &:active {
    color: var(--secondary-color);
  }
`;

const TooltipLabel = styled.span`
  margin-left: 10px;
  font-family: 'Merriweather', serif;
  font-size: 12px;
  font-weight: 300;
  color: var(--text-color);
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
`;

const ActionWithHint = styled.div`
  display: flex;
  align-items: center;
`;

export default function ActionButton({ iconClass = 'icon-add', className, onClick, size }) {
  return (
    <CustActionButton type="button" className={className} onClick={onClick}>
      <Icon className={iconClass} size={size} />
    </CustActionButton>
  );
}

/* ---------- Подсказка + кнопка (меню / избранное) ---------- */

function ButtonWithTooltip({ iconClass, onClick, label }) {
  return (
    <ActionWithHint>
      <ActionButton iconClass={iconClass} onClick={onClick} />
      {label ? <TooltipLabel>{label}</TooltipLabel> : null}
    </ActionWithHint>
  );
}

/** Подсказка слева от кнопки – круг оказывается у правого края (отзывы админ). */
const ActionWithHintEnd = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 10px;
`;

const TooltipLabelEnd = styled(TooltipLabel)`
  margin-left: 0;
`;

function ButtonWithTooltipEnd({ iconClass, onClick, label }) {
  return (
    <ActionWithHintEnd>
      <ActionButton iconClass={iconClass} onClick={onClick} />
      {label ? <TooltipLabelEnd>{label}</TooltipLabelEnd> : null}
    </ActionWithHintEnd>
  );
}

/* Меню (клиент): избранное – только левый верх фото (50% × 50%) */
const DishMenuFavSlot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const DishMenuFavHover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 50%;
  z-index: 2;

  &:hover ${DishMenuFavSlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function DishImageActionFavorite({ isFavorite, onToggle, labelAdd, labelRemove }) {
  const label = isFavorite ? labelRemove : labelAdd;
  const iconClass = isFavorite ? "icon-ok" : "icon-saved";
  return (
    <DishMenuFavHover>
      <DishMenuFavSlot>
        <ButtonWithTooltip
          iconClass={iconClass}
          onClick={onToggle}
          label={label}
        />
      </DishMenuFavSlot>
    </DishMenuFavHover>
  );
}

/* Меню (клиент): в корзину – только левый низ фото (50% × 50%) */
const DishMenuCartSlot = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const DishMenuCartHover = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 50%;
  z-index: 2;

  &:hover ${DishMenuCartSlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function DishImageActionMenuCartAdd({ onClick, label = "В корзину" }) {
  return (
    <DishMenuCartHover>
      <DishMenuCartSlot>
        <ButtonWithTooltip iconClass="icon-add" onClick={onClick} label={label} />
      </DishMenuCartSlot>
    </DishMenuCartHover>
  );
}

/* Избранное в ЛК: только нижняя половина фото – убрать из избранного */
const DishBottomOnlySlot = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const DishBottomOnlyHover = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 2;

  &:hover ${DishBottomOnlySlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function DishImageActionRemoveFavorite({ onClick, tooltip = 'Убрать из избранного' }) {
  return (
    <DishBottomOnlyHover>
      <DishBottomOnlySlot>
        <ButtonWithTooltip iconClass="icon-removed" onClick={onClick} label={tooltip} />
      </DishBottomOnlySlot>
    </DishBottomOnlyHover>
  );
}

/* ЛК избранное: верхняя половина фото – в корзину */
const DishTopHalfSlot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 6px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const DishTopHalfHover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 3;

  &:hover ${DishTopHalfSlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function DishImageActionAddToCartFavorite({ onClick, tooltip = "В корзину" }) {
  return (
    <DishTopHalfHover>
      <DishTopHalfSlot>
        <ButtonWithTooltip iconClass="icon-add" onClick={onClick} label={tooltip} />
      </DishTopHalfSlot>
    </DishTopHalfHover>
  );
}

/* Админ: удалить – только левый верх фото */
const DishAdminDeleteSlot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const DishAdminDeleteHover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 50%;
  z-index: 3;

  &:hover ${DishAdminDeleteSlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function DishImageActionAdmin({ onClick, tooltip = 'Удалить блюдо' }) {
  return (
    <DishAdminDeleteHover>
      <DishAdminDeleteSlot>
        <ButtonWithTooltip iconClass="icon-remove" onClick={onClick} label={tooltip} />
      </DishAdminDeleteSlot>
    </DishAdminDeleteHover>
  );
}

/* Отзывы (админ): удалить – правый верх карточки (50% × 50%), как зоны на фото в меню */
const ReviewAdminDeleteSlot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 8px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const ReviewAdminDeleteHover = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  z-index: 6;

  &:hover ${ReviewAdminDeleteSlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function ReviewCardAdminDelete({ onClick, tooltip = "Удалить отзыв" }) {
  return (
    <ReviewAdminDeleteHover>
      <ReviewAdminDeleteSlot>
        <ButtonWithTooltipEnd iconClass="icon-remove" onClick={onClick} label={tooltip} />
      </ReviewAdminDeleteSlot>
    </ReviewAdminDeleteHover>
  );
}

/* Отзывы (клиент): кнопка «добавить» в том же месте под слайдером, появляется при наведении на зону */
const ReviewsAddInner = styled.div`
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ReviewsAddZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  min-height: 48px;

  &:hover ${ReviewsAddInner} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function ReviewsAddReviewReveal({ onClick, label = "Добавить отзыв" }) {
  return (
    <ReviewsAddZone>
      <ReviewsAddInner>
        <ButtonWithTooltip iconClass="icon-add" onClick={onClick} label={label} />
      </ReviewsAddInner>
    </ReviewsAddZone>
  );
}

/* Админ: редактировать – только левый низ фото */
const DishAdminEditSlot = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const DishAdminEditHover = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 50%;
  z-index: 3;

  &:hover ${DishAdminEditSlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function DishImageActionAdminEdit({ onClick, tooltip = 'Редактировать блюдо' }) {
  return (
    <DishAdminEditHover>
      <DishAdminEditSlot>
        <ButtonWithTooltip iconClass="icon-edit" onClick={onClick} label={tooltip} />
      </DishAdminEditSlot>
    </DishAdminEditHover>
  );
}

const CategoryAdminAddInner = styled.div`
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

const CategoryAdminAddZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  margin-top: 8px;

  &:hover ${CategoryAdminAddInner} {
    opacity: 1;
    pointer-events: auto;
  }
`;

const CategoryAdminRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CategoryAdminHint = styled.span`
  font-family: 'Merriweather', serif;
  font-size: 12px;
  font-weight: 300;
  color: var(--text-color);
  text-transform: uppercase;
`;

export function CategoryAdminAddReveal({ children, hint = 'Добавить блюдо в категорию' }) {
  return (
    <CategoryAdminAddZone>
      <CategoryAdminAddInner>
        <CategoryAdminRow>
          {children}
          <CategoryAdminHint>{hint}</CategoryAdminHint>
        </CategoryAdminRow>
      </CategoryAdminAddInner>
    </CategoryAdminAddZone>
  );
}
