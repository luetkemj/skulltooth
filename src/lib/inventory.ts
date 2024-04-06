import { getEntity, removeComponent, ComponentTypes } from "../engine";

export const addItem = (itemEId: string, containerEId: string) => {
  const containerEntity = getEntity(containerEId);

  if (!containerEntity?.components.inventory) return;

  containerEntity.components.inventory.add(itemEId)

  removeComponent(itemEId, ComponentTypes.Position)
  removeComponent(itemEId, ComponentTypes.Legendable)
  removeComponent(itemEId, ComponentTypes.IsInFov)
};
