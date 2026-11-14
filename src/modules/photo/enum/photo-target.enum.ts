/**
 * 照片归属类型
 *
 * 统一照片表通过 target + targetId 构成多态关联，
 * 由 photo 模块集中管理，album / moment 模块只持有各自的主体实体。
 */
enum PhotoTarget {
  /** 相册照片，targetId 对应 album.id */
  Album = 'album',
  /** 动态照片，targetId 对应 moment.id */
  Moment = 'moment',
}

export default PhotoTarget;
