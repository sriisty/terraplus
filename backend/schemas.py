"""
Pydantic schemas for the Syngenta Track 1 campaign intelligence API.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class FarmerProfile(BaseModel):
    """Raw farmer, geography, crop, device, and campaign attributes."""

    grower_id: Optional[str] = Field(None, description="Unique grower identifier")
    state: Optional[str] = None
    district: Optional[str] = None
    tehsil_block: Optional[str] = Field(None, description="Tehsil, taluk, mandal, or block")
    village: Optional[str] = None
    language: Optional[str] = Field(None, description="Preferred language, if known")
    device_type: Optional[str] = Field(None, description="smartphone, feature_phone, keypad_phone")
    connectivity: Optional[str] = Field(None, description="good, weak, offline")
    literacy_level: Optional[str] = Field(None, description="low, medium, high")
    gender: Optional[str] = None
    grower_age: Optional[float] = Field(None, ge=0, le=120)
    grower_farm_size: Optional[float] = Field(None, ge=0)
    high_value_farmer: Optional[bool] = False

    grower_crop_calendar: Optional[str] = None
    main_crop: Optional[str] = None
    crop_stage: Optional[str] = Field(None, description="Known growth stage override")
    sowing_start: Optional[str] = None
    harvest_start: Optional[str] = None
    season: Optional[str] = Field(None, description="Kharif, Rabi, Zaid, or local season label")

    pest_threat: Optional[str] = Field(None, description="Active pest or disease threat")
    pest_risk_level: Optional[str] = Field(None, description="low, medium, high")
    weather_risk: Optional[str] = Field(None, description="rain, dry spell, humidity, heat, etc.")

    product_scan: Optional[bool] = False
    offline_campaign_attended: Optional[bool] = False

    campaign_crop: Optional[str] = None
    campaign_product: Optional[str] = None
    message_sent_date: Optional[str] = None

    hist_open_rate: Optional[float] = Field(0.0, ge=0, le=1)
    hist_click_rate: Optional[float] = Field(0.0, ge=0, le=1)
    message_count_history: Optional[int] = Field(0, ge=0)
    days_since_last_message: Optional[float] = Field(999.0, ge=0)
    message_frequency: Optional[float] = Field(0.0, ge=0)

    @field_validator("grower_age", "grower_farm_size", mode="before")
    @classmethod
    def coerce_numeric(cls, v: Any) -> Optional[float]:
        if v is None or v == "":
            return None
        try:
            return float(v)
        except (TypeError, ValueError):
            return None


class PredictionRequest(BaseModel):
    farmer: FarmerProfile
    farmer_name: Optional[str] = Field("Kisan bhai", description="Display name for advisory")


class BatchPredictionRequest(BaseModel):
    farmers: List[FarmerProfile] = Field(..., min_length=1, max_length=500)


class EngagementPrediction(BaseModel):
    engagement_probability: float = Field(..., ge=0, le=1)
    segment: str = Field(..., description="Low | Medium | High | Very High")
    confidence: str = Field(..., description="low | medium | high")
    model_version: str
    features_used: int


class ChannelRecommendation(BaseModel):
    primary_channel: str
    alternative_channels: List[str]
    send_window: Dict[str, Any]
    frequency_per_month: int
    personalisation_tips: List[str]
    priority_score: int = Field(..., ge=0, le=100)
    rationale: List[str] = Field(default_factory=list)


class VernacularProfile(BaseModel):
    language: str
    fallback_language: str
    script: str
    region_style: str
    complexity_level: str
    voice_first: bool
    sms_safe: bool


class RAGContext(BaseModel):
    query: str
    advisory_summary: str
    sources: List[Dict[str, Any]]
    mode: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None


class RecommendedMedia(BaseModel):
    type: str
    topic: str
    caption: str
    video_script: Optional[str] = None


class UrgencyRecommendation(BaseModel):
    urgency_score: int = Field(..., ge=0, le=100)
    urgency_level: str
    urgency_reasons: List[str] = Field(default_factory=list)


class ContentRecommendation(BaseModel):
    primary_message: str
    alternative_message: Optional[str]
    subject_line: str
    cta_text: str
    content_tips: List[str]
    language_note: str
    personalisation_level: str
    sms: str
    whatsapp: str
    voice_script: str
    generation_mode: str
    recommended_media: Optional[RecommendedMedia] = None
    audio_file: Optional[str] = None


class PredictionResponse(BaseModel):
    grower_id: Optional[str]
    prediction: EngagementPrediction
    channel: ChannelRecommendation
    vernacular: VernacularProfile
    urgency: UrgencyRecommendation
    engagement_reasoning: List[str]
    rag: RAGContext
    content: ContentRecommendation


class BatchPredictionResponse(BaseModel):
    total: int
    results: List[PredictionResponse]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    n_features: int
    model_version: str
    roc_auc: float
