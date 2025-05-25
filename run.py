import subprocess

from optimum_picks_api.app import create_app

app = create_app()

if __name__ == '__main__':
    # Run the Flask app
    flask_process = subprocess.Popen(['flask', 'run'], cwd='optimum_picks_api')
    print("Flask app running on port 5000")
    # Run the React frontend
    react_process = subprocess.Popen(['npm', 'start'], cwd='optimum-picks')
    print("React frontend running on port 3000")
    # Wait for both processes to complete
    flask_process.wait()
    react_process.wait()