import mongoose, { Schema, Document } from 'mongoose';

export interface IDataPoint extends Document {
  end_year: string;
  intensity: number;
  sector: string;
  topic: string;
  insight: string;
  url: string;
  region: string;
  start_year: string;
  impact: string;
  added: string;
  published: string;
  country: string;
  relevance: number;
  pestle: string;
  source: string;
  title: string;
  likelihood: number;
  city?: string;
  swot?: string;
}

const DataPointSchema: Schema = new Schema({
  end_year: { type: String, default: '' },
  intensity: { type: Number, default: 0 },
  sector: { type: String, default: '' },
  topic: { type: String, default: '' },
  insight: { type: String, default: '' },
  url: { type: String, default: '' },
  region: { type: String, default: '' },
  start_year: { type: String, default: '' },
  impact: { type: String, default: '' },
  added: { type: String, default: '' },
  published: { type: String, default: '' },
  country: { type: String, default: '' },
  relevance: { type: Number, default: 0 },
  pestle: { type: String, default: '' },
  source: { type: String, default: '' },
  title: { type: String, default: '' },
  likelihood: { type: Number, default: 0 },
  city: { type: String, default: '' },
  swot: { type: String, default: '' },
}, {
  timestamps: false,
});

export default mongoose.models.DataPoint || mongoose.model<IDataPoint>('DataPoint', DataPointSchema);

