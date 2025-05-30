import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ImageMetadata } from "@/uploads/entity/image-metadata.entity";

import { MenuPositionDetails } from "./menu-position-details.entity";
import { MenuPosition } from "./menu-position.entity";

@Entity({ schema: "menu" })
export class MenuPositionImage extends ImageMetadata {
  @OneToOne(() => MenuPosition, (menuPosition) => menuPosition.coreImage)
  @JoinColumn()
  menuPosition: MenuPosition;
}
@Entity()
export class MenuPositionDetailsImage extends ImageMetadata {
  @ManyToOne(() => MenuPositionDetails, (menuPositionDetails) => menuPositionDetails.images)
  @JoinColumn()
  menuPositionDetails: MenuPositionDetails;
}
