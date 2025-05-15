# app.py
from flask import Flask, render_template, request, jsonify
import numpy as np
from scipy import linalg
import json
import re

app = Flask(__name__)

# New helper function to parse matrix text input
def parse_matrix_text(text):
    """
    Parse matrix text input in the format:
    1 2 3; 4 5 6; 7 8 9
    Returns a numpy array
    """
    try:
        # Remove any extra whitespace and split by semicolons
        text = text.strip()
        rows = text.split(';')
        matrix = []
        
        for row in rows:
            # Split by whitespace and convert to float
            values = re.split(r'\s+', row.strip())
            numeric_values = [float(val) for val in values if val]
            if numeric_values:  # Only add non-empty rows
                matrix.append(numeric_values)
        
        # Validate all rows have the same length
        if matrix and not all(len(row) == len(matrix[0]) for row in matrix):
            raise ValueError("All rows must have the same number of columns")
            
        return np.array(matrix, dtype=float)
    except Exception as e:
        raise ValueError(f"Error parsing matrix text: {str(e)}")

# New helper function to parse vector text input
def parse_vector_text(text):
    """
    Parse vector text input in the format:
    1 2 3 4 5
    Returns a numpy array
    """
    try:
        # Remove any extra whitespace and split by whitespace
        text = text.strip()
        values = re.split(r'\s+', text)
        vector = [float(val) for val in values if val]
        return np.array(vector, dtype=float)
    except Exception as e:
        raise ValueError(f"Error parsing vector text: {str(e)}")

# Modified helper functions to handle text input option
def matrix_add(matrix_a, matrix_b):
    try:
        # Check if inputs are strings (text format)
        if isinstance(matrix_a, str):
            a = parse_matrix_text(matrix_a)
        else:
            a = np.array(matrix_a, dtype=float)
            
        if isinstance(matrix_b, str):
            b = parse_matrix_text(matrix_b)
        else:
            b = np.array(matrix_b, dtype=float)
            
        if a.shape != b.shape:
            return {"error": "Matrices must have the same dimensions"}
        result = a + b
        return {"result": result.tolist()}
    except Exception as e:
        return {"error": str(e)}

def matrix_multiply(matrix_a, matrix_b):
    try:
        # Check if inputs are strings (text format)
        if isinstance(matrix_a, str):
            a = parse_matrix_text(matrix_a)
        else:
            a = np.array(matrix_a, dtype=float)
            
        if isinstance(matrix_b, str):
            b = parse_matrix_text(matrix_b)
        else:
            b = np.array(matrix_b, dtype=float)
            
        if a.shape[1] != b.shape[0]:
            return {"error": "Number of columns in first matrix must equal number of rows in second matrix"}
        result = np.matmul(a, b)
        return {"result": result.tolist()}
    except Exception as e:
        return {"error": str(e)}

def matrix_determinant(matrix):
    try:
        # Check if input is a string (text format)
        if isinstance(matrix, str):
            m = parse_matrix_text(matrix)
        else:
            m = np.array(matrix, dtype=float)
            
        if m.shape[0] != m.shape[1]:
            return {"error": "Matrix must be square"}
        result = np.linalg.det(m)
        return {"result": float(result)}
    except Exception as e:
        return {"error": str(e)}

def matrix_inverse(matrix):
    try:
        # Check if input is a string (text format)
        if isinstance(matrix, str):
            m = parse_matrix_text(matrix)
        else:
            m = np.array(matrix, dtype=float)
            
        if m.shape[0] != m.shape[1]:
            return {"error": "Matrix must be square"}
        result = np.linalg.inv(m)
        return {"result": result.tolist()}
    except np.linalg.LinAlgError:
        return {"error": "Matrix is singular and cannot be inverted"}
    except Exception as e:
        return {"error": str(e)}

def matrix_transpose(matrix):
    try:
        # Check if input is a string (text format)
        if isinstance(matrix, str):
            m = parse_matrix_text(matrix)
        else:
            m = np.array(matrix, dtype=float)
            
        result = np.transpose(m)
        return {"result": result.tolist()}
    except Exception as e:
        return {"error": str(e)}

def matrix_rank(matrix):
    try:
        # Check if input is a string (text format)
        if isinstance(matrix, str):
            m = parse_matrix_text(matrix)
        else:
            m = np.array(matrix, dtype=float)
            
        result = np.linalg.matrix_rank(m)
        return {"result": int(result)}
    except Exception as e:
        return {"error": str(e)}

def solve_system(coefficients, constants):
    try:
        # Check if inputs are strings (text format)
        if isinstance(coefficients, str):
            a = parse_matrix_text(coefficients)
        else:
            a = np.array(coefficients, dtype=float)
            
        if isinstance(constants, str):
            b = parse_vector_text(constants)
        else:
            b = np.array(constants, dtype=float)
            
        # Ensure the vector has the right dimension
        if a.shape[0] != b.shape[0]:
            return {"error": "Number of equations (rows) must match the number of constants"}
            
        try:
            x = np.linalg.solve(a, b)
            return {"solution": x.tolist(), "unique": True}
        except np.linalg.LinAlgError:
            # If direct solution fails, try least squares solution
            x, residuals, rank, s = np.linalg.lstsq(a, b, rcond=None)
            
            # Check if the system is underdetermined (has multiple solutions)
            if rank < min(a.shape):
                return {
                    "solution": "The system has infinitely many solutions",
                    "unique": False,
                    "message": "The system is underdetermined (rank < variables)"
                }
            # Check if the system is overdetermined and inconsistent
            elif len(residuals) > 0 and not np.isclose(residuals[0], 0):
                return {
                    "solution": x.tolist(),
                    "unique": False, 
                    "message": "The system is overdetermined and inconsistent. Least squares solution provided.",
                    "residuals": float(residuals[0])
                }
            else:
                return {
                    "solution": x.tolist(),
                    "unique": True
                }
    except Exception as e:
        return {"error": str(e)}

def compute_eigen(matrix):
    try:
        # Check if input is a string (text format)
        if isinstance(matrix, str):
            m = parse_matrix_text(matrix)
        else:
            m = np.array(matrix, dtype=float)
            
        if m.shape[0] != m.shape[1]:
            return {"error": "Matrix must be square"}
        
        eigenvalues, eigenvectors = np.linalg.eig(m)
        
        # Convert complex numbers to strings if necessary
        eigenvalues_list = []
        for val in eigenvalues:
            if np.isclose(val.imag, 0):
                eigenvalues_list.append(float(val.real))
            else:
                eigenvalues_list.append(complex(val).__str__())
        
        # Convert eigenvectors to list
        eigenvectors_list = []
        for i in range(eigenvectors.shape[1]):
            vec = eigenvectors[:, i]
            if np.isclose(np.imag(vec), 0).all():
                eigenvectors_list.append(np.real(vec).tolist())
            else:
                # Format complex numbers as strings
                complex_vec = []
                for v in vec:
                    if np.isclose(v.imag, 0):
                        complex_vec.append(float(v.real))
                    else:
                        complex_vec.append(complex(v).__str__())
                eigenvectors_list.append(complex_vec)
        
        return {
            "eigenvalues": eigenvalues_list,
            "eigenvectors": eigenvectors_list
        }
    except Exception as e:
        return {"error": str(e)}

def vector_dot(vector_a, vector_b):
    try:
        # Check if inputs are strings (text format)
        if isinstance(vector_a, str):
            a = parse_vector_text(vector_a)
        else:
            a = np.array(vector_a, dtype=float)
            
        if isinstance(vector_b, str):
            b = parse_vector_text(vector_b)
        else:
            b = np.array(vector_b, dtype=float)
            
        if a.shape != b.shape:
            return {"error": "Vectors must have the same dimensions"}
        result = np.dot(a, b)
        return {"result": float(result)}
    except Exception as e:
        return {"error": str(e)}

def vector_cross(vector_a, vector_b):
    try:
        # Check if inputs are strings (text format)
        if isinstance(vector_a, str):
            a = parse_vector_text(vector_a)
        else:
            a = np.array(vector_a, dtype=float)
            
        if isinstance(vector_b, str):
            b = parse_vector_text(vector_b)
        else:
            b = np.array(vector_b, dtype=float)
            
        if a.shape != (3,) or b.shape != (3,):
            return {"error": "Cross product requires 3D vectors"}
        result = np.cross(a, b)
        return {"result": result.tolist()}
    except Exception as e:
        return {"error": str(e)}

def matrix_svd(matrix):
    try:
        # Check if input is a string (text format)
        if isinstance(matrix, str):
            m = parse_matrix_text(matrix)
        else:
            m = np.array(matrix, dtype=float)
            
        U, S, Vh = np.linalg.svd(m, full_matrices=False)
        return {
            "U": U.tolist(),
            "S": S.tolist(),
            "Vt": Vh.tolist()  # Renamed to Vt to be more standard
        }
    except Exception as e:
        return {"error": str(e)}

# API Routes with modifications to accept text input
@app.route('/api/matrix/add', methods=['POST'])
def api_matrix_add():
    data = request.json
    matrix_a = data.get('matrixA')
    matrix_b = data.get('matrixB')
    matrix_a_text = data.get('matrixAText')
    matrix_b_text = data.get('matrixBText')
    
    # Use text input if provided
    if matrix_a_text:
        matrix_a = matrix_a_text
    if matrix_b_text:
        matrix_b = matrix_b_text
        
    return jsonify(matrix_add(matrix_a, matrix_b))

@app.route('/api/matrix/multiply', methods=['POST'])
def api_matrix_multiply():
    data = request.json
    matrix_a = data.get('matrixA')
    matrix_b = data.get('matrixB')
    matrix_a_text = data.get('matrixAText')
    matrix_b_text = data.get('matrixBText')
    
    # Use text input if provided
    if matrix_a_text:
        matrix_a = matrix_a_text
    if matrix_b_text:
        matrix_b = matrix_b_text
        
    return jsonify(matrix_multiply(matrix_a, matrix_b))

@app.route('/api/matrix/determinant', methods=['POST'])
def api_matrix_determinant():
    data = request.json
    matrix = data.get('matrix')
    matrix_text = data.get('matrixText')
    
    # Use text input if provided
    if matrix_text:
        matrix = matrix_text
        
    return jsonify(matrix_determinant(matrix))

@app.route('/api/matrix/inverse', methods=['POST'])
def api_matrix_inverse():
    data = request.json
    matrix = data.get('matrix')
    matrix_text = data.get('matrixText')
    
    # Use text input if provided
    if matrix_text:
        matrix = matrix_text
        
    return jsonify(matrix_inverse(matrix))

@app.route('/api/matrix/transpose', methods=['POST'])
def api_matrix_transpose():
    data = request.json
    matrix = data.get('matrix')
    matrix_text = data.get('matrixText')
    
    # Use text input if provided
    if matrix_text:
        matrix = matrix_text
        
    return jsonify(matrix_transpose(matrix))

@app.route('/api/matrix/rank', methods=['POST'])
def api_matrix_rank():
    data = request.json
    matrix = data.get('matrix')
    matrix_text = data.get('matrixText')
    
    # Use text input if provided
    if matrix_text:
        matrix = matrix_text
        
    return jsonify(matrix_rank(matrix))

@app.route('/api/system/solve', methods=['POST'])
def api_solve_system():
    data = request.json
    coefficients = data.get('coefficients')
    constants = data.get('constants')
    coefficients_text = data.get('coefficientsText')
    constants_text = data.get('constantsText')
    
    # Use text input if provided
    if coefficients_text:
        coefficients = coefficients_text
    if constants_text:
        constants = constants_text
        
    return jsonify(solve_system(coefficients, constants))

@app.route('/api/matrix/eigen', methods=['POST'])
def api_compute_eigen():
    data = request.json
    matrix = data.get('matrix')
    matrix_text = data.get('matrixText')
    
    # Use text input if provided
    if matrix_text:
        matrix = matrix_text
        
    return jsonify(compute_eigen(matrix))

@app.route('/api/vector/dot', methods=['POST'])
def api_vector_dot():
    data = request.json
    vector_a = data.get('vectorA')
    vector_b = data.get('vectorB')
    vector_a_text = data.get('vectorAText')
    vector_b_text = data.get('vectorBText')
    
    # Use text input if provided
    if vector_a_text:
        vector_a = vector_a_text
    if vector_b_text:
        vector_b = vector_b_text
        
    return jsonify(vector_dot(vector_a, vector_b))

@app.route('/api/vector/cross', methods=['POST'])
def api_vector_cross():
    data = request.json
    vector_a = data.get('vectorA')
    vector_b = data.get('vectorB')
    vector_a_text = data.get('vectorAText')
    vector_b_text = data.get('vectorBText')
    
    # Use text input if provided
    if vector_a_text:
        vector_a = vector_a_text
    if vector_b_text:
        vector_b = vector_b_text
        
    return jsonify(vector_cross(vector_a, vector_b))

@app.route('/api/matrix/svd', methods=['POST'])
def api_matrix_svd():
    data = request.json
    matrix = data.get('matrix')
    matrix_text = data.get('matrixText')
    
    # Use text input if provided
    if matrix_text:
        matrix = matrix_text
        
    return jsonify(matrix_svd(matrix))

# Add these functions to your existing Python backend

def parse_matrix(matrix_text):
    """Parse matrix from text format to numpy array."""
    try:
        # Split by rows (semicolons) and then by elements (spaces)
        rows = matrix_text.strip().split(';')
        matrix = []
        for row in rows:
            elements = [float(x) for x in row.strip().split()]
            matrix.append(elements)
        return np.array(matrix)
    except Exception as e:
        raise ValueError(f"Invalid matrix format: {str(e)}")

def complex_to_dict(complex_num):
    """Convert complex number to dictionary format for JSON serialization."""
    if isinstance(complex_num, complex):
        return {"re": complex_num.real, "im": complex_num.imag}
    return complex_num

# Eigenvalue calculations
@app.route('/api/matrix/eigen', methods=['POST'])
def calculate_eigenvalues():
    try:
        data = request.json
        matrix_text = data.get('matrixText', '')
        
        # Parse the matrix
        matrix = parse_matrix(matrix_text)
        
        # Check if the matrix is square
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({"error": "Matrix must be square to calculate eigenvalues."})
        
        # Calculate eigenvalues and eigenvectors
        eigenvalues, eigenvectors = np.linalg.eig(matrix)
        
        # Convert complex eigenvalues to serializable format
        eigenvalues_json = [complex_to_dict(val) for val in eigenvalues]
        
        # Transpose eigenvectors for better representation
        # Each column of eigenvectors corresponds to an eigenvalue
        eigenvectors_list = []
        for i in range(len(eigenvalues)):
            vector = eigenvectors[:, i]
            vector_json = [complex_to_dict(val) for val in vector]
            eigenvectors_list.append(vector_json)
        
        return jsonify({
            "eigenvalues": eigenvalues_json,
            "eigenvectors": eigenvectors_list
        })
        
    except ValueError as e:
        return jsonify({"error": str(e)})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

# LU Decomposition
@app.route('/api/matrix/lu', methods=['POST'])
def calculate_lu_decomposition():
    try:
        data = request.json
        matrix_text = data.get('matrixText', '')
        
        # Parse the matrix
        matrix = parse_matrix(matrix_text)
        
        # Calculate LU decomposition with partial pivoting
        P, L, U = linalg.lu(matrix)
        
        return jsonify({
            "P": P.tolist(),
            "L": L.tolist(),
            "U": U.tolist()
        })
        
    except ValueError as e:
        return jsonify({"error": str(e)})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

# QR Decomposition
@app.route('/api/matrix/qr', methods=['POST'])
def calculate_qr_decomposition():
    try:
        data = request.json
        matrix_text = data.get('matrixText', '')
        
        # Parse the matrix
        matrix = parse_matrix(matrix_text)
        
        # Calculate QR decomposition
        Q, R = np.linalg.qr(matrix)
        
        return jsonify({
            "Q": Q.tolist(),
            "R": R.tolist()
        })
        
    except ValueError as e:
        return jsonify({"error": str(e)})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

# Singular Value Decomposition (SVD)
@app.route('/api/matrix/svd', methods=['POST'])
def calculate_svd_decomposition():
    try:
        data = request.json
        matrix_text = data.get('matrixText', '')
        
        # Parse the matrix
        matrix = parse_matrix(matrix_text)
        
        # Calculate SVD
        U, s, Vt = np.linalg.svd(matrix, full_matrices=True)
        
        # Convert singular values to diagonal matrix
        S = np.zeros(matrix.shape)
        min_dim = min(matrix.shape)
        S[:min_dim, :min_dim] = np.diag(s)
        
        return jsonify({
            "U": U.tolist(),
            "S": S.tolist(),
            "Vt": Vt.tolist()
        })
        
    except ValueError as e:
        return jsonify({"error": str(e)})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

# Cholesky Decomposition
@app.route('/api/matrix/cholesky', methods=['POST'])
def calculate_cholesky_decomposition():
    try:
        data = request.json
        matrix_text = data.get('matrixText', '')
        
        # Parse the matrix
        matrix = parse_matrix(matrix_text)
        
        # Check if matrix is square
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({"error": "Matrix must be square for Cholesky decomposition."})
        
        # Check if matrix is symmetric
        if not np.allclose(matrix, matrix.T):
            return jsonify({"error": "Matrix must be symmetric for Cholesky decomposition."})
        
        try:
            # Calculate Cholesky decomposition
            L = np.linalg.cholesky(matrix)
            return jsonify({
                "L": L.tolist()
            })
        except np.linalg.LinAlgError:
            return jsonify({"error": "Matrix must be positive definite for Cholesky decomposition."})
        
    except ValueError as e:
        return jsonify({"error": str(e)})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

# Characteristic Polynomial
@app.route('/api/matrix/characteristic-polynomial', methods=['POST'])
def calculate_characteristic_polynomial():
    try:
        data = request.json
        matrix_text = data.get('matrixText', '')
        
        # Parse the matrix
        matrix = parse_matrix(matrix_text)
        
        # Check if matrix is square
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({"error": "Matrix must be square to calculate characteristic polynomial."})
        
        # Calculate the characteristic polynomial coefficients
        coeffs = np.poly(matrix)
        
        # Format polynomial string
        n = len(coeffs) - 1
        polynomial = ""
        
        for i, coeff in enumerate(coeffs):
            power = n - i
            coeff_rounded = round(coeff, 4)
            
            if coeff_rounded == 0:
                continue
                
            if i > 0 and coeff_rounded > 0:
                polynomial += " + "
            elif i > 0:
                polynomial += " - "
                coeff_rounded = abs(coeff_rounded)
            
            if power == 0:
                polynomial += f"{coeff_rounded}"
            elif power == 1:
                if coeff_rounded == 1:
                    polynomial += "λ"
                else:
                    polynomial += f"{coeff_rounded}λ"
            else:
                if coeff_rounded == 1:
                    polynomial += f"λ^{power}"
                else:
                    polynomial += f"{coeff_rounded}λ^{power}"
        
        # Calculate the roots (eigenvalues)
        roots = np.roots(coeffs)
        roots_json = [complex_to_dict(root) for root in roots]
        
        return jsonify({
            "polynomial": polynomial,
            "roots": roots_json
        })
        
    except ValueError as e:
        return jsonify({"error": str(e)})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

# Main route to serve the application
@app.route('/')
def index():
    return render_template('index.html')

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
