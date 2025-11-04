import mongoose, { Schema, Document, Model } from 'mongoose';
import Event from './event.model';

/**
 * TypeScript interface for Booking document
 * Extends mongoose Document to include all Booking fields
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Schema Definition
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Add index for faster queries
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Throws an error if the event is not found in the database
 */
bookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or has been modified
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.exists({ _id: this.eventId });
      
      if (!eventExists) {
        throw new Error(
          `Event with ID ${this.eventId} does not exist. Cannot create booking for non-existent event.`
        );
      }
    } catch (error) {
      // Pass the error to the next middleware
      if (error instanceof Error) {
        return next(error);
      }
      return next(new Error('Failed to validate event reference'));
    }
  }

  next();
});

/**
 * Add compound index for efficient queries by event and email
 */
bookingSchema.index({ eventId: 1, email: 1 });

/**
 * Export Booking model
 * Use existing model if already compiled (prevents OverwriteModelError in development)
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
