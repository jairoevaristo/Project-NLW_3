import Orphanages from '../models/Orphanage'
import imagesView from './images_view';

export default {
  render(orphanage: Orphanages) {
    return {
      id: orphanage.id,
      name: orphanage.name,
      telephone: orphanage.telephone,
      latitude: orphanage.latitude,
      longitude: orphanage.longitude,
      about: orphanage.about,
      instructions: orphanage.instructions,
      opening_hours: orphanage.opening_hours,
      open_on_weekends: orphanage.open_on_weekends,
      images: imagesView.renderMany(orphanage.images),
    };
  },
  renderMany(orphanage: Orphanages[]) {
    return orphanage.map(orphanage => this.render(orphanage))
  }
};