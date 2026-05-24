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

const TooltipBubble = styled.span`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  padding: 5px 10px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--decorate-bg) 94%, #000);
  border: 1px solid color-mix(in srgb, var(--primary-color) 38%, transparent);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  font-family: 'Merriweather', serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: var(--text-color);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.18s ease, visibility 0.18s ease;
  z-index: 30;
`;

const TooltipWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &:hover ${TooltipBubble},
  &:focus-within ${TooltipBubble} {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipWrapEnd = styled(TooltipWrap)`
  ${TooltipBubble} {
    left: auto;
    right: 0;
    transform: none;
  }
`;

/** Подсказка под кнопкой (правый верх карточки). */
const TooltipWrapEndBelow = styled(TooltipWrapEnd)`
  ${TooltipBubble} {
    bottom: auto;
    top: calc(100% + 8px);
  }
`;

function ButtonWithTooltipEndBelow({ iconClass, onClick, label }) {
  return (
    <TooltipWrapEndBelow>
      <ActionButton
        iconClass={iconClass}
        onClick={onClick}
        aria-label={label || undefined}
      />
      {label ? <TooltipBubble role="tooltip">{label}</TooltipBubble> : null}
    </TooltipWrapEndBelow>
  );
}

export default function ActionButton({
  iconClass = 'icon-add',
  className,
  onClick,
  size,
  'aria-label': ariaLabel,
}) {
  return (
    <CustActionButton
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon className={iconClass} size={size} />
    </CustActionButton>
  );
}

/* ---------- Подсказка при наведении (не сдвигает вёрстку) ---------- */

function ButtonWithTooltip({ iconClass, onClick, label }) {
  return (
    <TooltipWrap>
      <ActionButton
        iconClass={iconClass}
        onClick={onClick}
        aria-label={label || undefined}
      />
      {label ? <TooltipBubble role="tooltip">{label}</TooltipBubble> : null}
    </TooltipWrap>
  );
}

/** Кнопка у правого края – подсказка выравнивается вправо. */
function ButtonWithTooltipEnd({ iconClass, onClick, label }) {
  return (
    <TooltipWrapEnd>
      <ActionButton
        iconClass={iconClass}
        onClick={onClick}
        aria-label={label || undefined}
      />
      {label ? <TooltipBubble role="tooltip">{label}</TooltipBubble> : null}
    </TooltipWrapEnd>
  );
}

const dishActionSlotBase = `
  overflow: visible;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
`;

/* Углы фото: классы в Menu.css — одинаковые отступы в меню и в избранном */
function DishImageActionTopLeft({ iconClass, onClick, label }) {
  return (
    <div className="dish-action-zone--top-left">
      <div className="dish-action-slot--top-left">
        <ButtonWithTooltip iconClass={iconClass} onClick={onClick} label={label} />
      </div>
    </div>
  );
}

function DishImageActionBottomLeft({ iconClass, onClick, label }) {
  return (
    <div className="dish-action-zone--bottom-left">
      <div className="dish-action-slot--bottom-left">
        <ButtonWithTooltip iconClass={iconClass} onClick={onClick} label={label} />
      </div>
    </div>
  );
}

export function DishImageActionFavorite({ isFavorite, onToggle, labelAdd, labelRemove }) {
  const label = isFavorite ? labelRemove : labelAdd;
  const iconClass = isFavorite ? "icon-ok" : "icon-saved";
  return (
    <DishImageActionTopLeft
      iconClass={iconClass}
      onClick={onToggle}
      label={label}
    />
  );
}

export function DishImageActionMenuCartAdd({ onClick, label = "В корзину" }) {
  return (
    <DishImageActionBottomLeft iconClass="icon-add" onClick={onClick} label={label} />
  );
}

export function DishImageActionRemoveFavorite({ onClick, tooltip = "Убрать из избранного" }) {
  return (
    <DishImageActionBottomLeft
      iconClass="icon-removed"
      onClick={onClick}
      label={tooltip}
    />
  );
}

export function DishImageActionAddToCartFavorite({ onClick, tooltip = "В корзину" }) {
  return (
    <DishImageActionTopLeft iconClass="icon-add" onClick={onClick} label={tooltip} />
  );
}

/* Админ: удалить – только левый верх фото */
const DishAdminDeleteSlot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  ${dishActionSlotBase}
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

/* Отзывы (админ): удалить – правый верх карточки (50% × 50%) */
const ReviewAdminDeleteSlot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  ${dishActionSlotBase}
  padding: 6px 8px;
`;

const ReviewAdminDeleteHover = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  z-index: 20;

  &:hover ${ReviewAdminDeleteSlot} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export function ReviewCardAdminDelete({ onClick, tooltip = "Удалить отзыв" }) {
  return (
    <ReviewAdminDeleteHover>
      <ReviewAdminDeleteSlot>
        <ButtonWithTooltipEndBelow iconClass="icon-remove" onClick={onClick} label={tooltip} />
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
  ${dishActionSlotBase}
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

export function CategoryAdminAddReveal({ children, hint = 'Добавить блюдо в категорию' }) {
  return (
    <CategoryAdminAddZone>
      <CategoryAdminAddInner>
        <TooltipWrap>
          {children}
          {hint ? <TooltipBubble role="tooltip">{hint}</TooltipBubble> : null}
        </TooltipWrap>
      </CategoryAdminAddInner>
    </CategoryAdminAddZone>
  );
}
