# OptimumPicks Flask API

Backend API for OptimumPicks sports betting odds visualization application, built with Flask and PostgreSQL.

## Technology Stack

- **Flask**: Python web framework
- **SQLAlchemy**: ORM for database interactions
- **PostgreSQL**: Relational database for data storage
- **Flask-RESTful**: Extension for building REST APIs
- **Flask-Migrate**: Database migrations
- **Python 3.8+**: Programming language
- **Pytest**: Testing framework

## Features

- RESTful API for sports betting odds
- Fully typed models with SQLAlchemy
- Database migrations with Alembic
- Input validation and output serialization
- CORS support
- Environment-based configuration

## Project Structure

```
optimum-picks-flask/
├── app/
│   ├── config/       # Application configuration
│   ├── models/       # Database models
│   ├── routes/       # API endpoints
│   ├── schemas/      # Request/response schemas
│   ├── services/     # Business logic
│   └── utils/        # Helper functions
├── migrations/       # Database migrations
├── tests/            # Test suite
├── .env.example      # Example environment variables
├── run.py            # Application entry point
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Virtual environment tool (venv, pipenv, or conda)

### Installation

1. Clone the repository
2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example` with your database credentials
5. Initialize the database:
   ```
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```
6. Seed initial data:
   ```
   flask seed-db
   ```

### Running the API

Development mode:
```
python run.py
```

Or with Flask CLI:
```
flask run
```

## API Endpoints

### Health Check
- `GET /api/health`: Check if API is running

### Odds
- `GET /api/odds`: Get all betting odds (with filtering)
- `GET /api/odds/{id}`: Get odds by ID
- `POST /api/odds`: Create new odds entry
- `PUT /api/odds/{id}`: Update odds entry
- `DELETE /api/odds/{id}`: Delete odds entry

### Sports
- `GET /api/sports`: Get all sports
- `GET /api/sports/{id}`: Get sport by ID

## Machine Learning Integration

This API is designed to easily integrate with Python ML libraries:

- **Data Processing**: Direct integration with pandas for odds data analysis
- **Prediction Models**: Seamless connection to scikit-learn, PyTorch, or TensorFlow
- **Feature Engineering**: Built-in modules for betting-specific feature creation
- **Real-time Inference**: API endpoints for model predictions

## Future Enhancements

- Complete authentication system
- WebSocket support for real-time odds updates
- Automated scraping system for odds collection
- Machine learning model deployment
- Historical data analysis endpoints
- Performance metrics and monitoring 